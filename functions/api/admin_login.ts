// 관리자 로그인 API.
// 자격 증명은 Cloudflare Pages의 환경변수(ADMIN_EMAIL / ADMIN_PASSWORD)에만 존재한다.
// 성공 시 HMAC 서명된 세션 토큰을 HttpOnly 쿠키로 발급한다.
// 토큰 서명 키를 ADMIN_PASSWORD에서 파생하므로, 비밀번호를 바꾸면 기존 세션이 모두 무효화된다.

interface Env {
    ADMIN_EMAIL?: string;
    ADMIN_PASSWORD?: string;
}

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7일

const enc = new TextEncoder();

const b64url = (buf: ArrayBuffer) =>
    btoa(String.fromCharCode(...new Uint8Array(buf)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

async function hmacKey(password: string): Promise<CryptoKey> {
    const material = await crypto.subtle.digest('SHA-256', enc.encode('dt-admin-session:' + password));
    return crypto.subtle.importKey('raw', material, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

export async function signSession(password: string, expMs: number): Promise<string> {
    const key = await hmacKey(password);
    const sig = await crypto.subtle.sign('HMAC', key, enc.encode(String(expMs)));
    return `${expMs}.${b64url(sig)}`;
}

export async function verifySession(password: string, token: string | undefined | null): Promise<boolean> {
    if (!token) return false;
    const dot = token.indexOf('.');
    if (dot <= 0) return false;
    const expMs = Number(token.slice(0, dot));
    if (!Number.isFinite(expMs) || expMs < Date.now()) return false;
    const expected = await signSession(password, expMs);
    // 길이가 같을 때만 바이트 비교 (사실상 상수 시간)
    if (expected.length !== token.length) return false;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
    return diff === 0;
}

export function readSessionCookie(request: Request): string | null {
    const cookie = request.headers.get('Cookie') || '';
    const m = cookie.match(/(?:^|;\s*)dt_admin=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : null;
}

// 두 문자열을 해시 후 비교해 타이밍 차이를 없앤다.
async function safeEqual(a: string, b: string): Promise<boolean> {
    const [ha, hb] = await Promise.all([
        crypto.subtle.digest('SHA-256', enc.encode(a)),
        crypto.subtle.digest('SHA-256', enc.encode(b)),
    ]);
    const ua = new Uint8Array(ha), ub = new Uint8Array(hb);
    let diff = 0;
    for (let i = 0; i < ua.length; i++) diff |= ua[i] ^ ub[i];
    return diff === 0;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
    if (!env.ADMIN_PASSWORD) {
        return new Response(JSON.stringify({
            error: 'ADMIN_PASSWORD 환경변수가 설정되지 않았습니다. Cloudflare Pages → Settings → Variables and Secrets에서 설정 후 재배포하세요.',
        }), { status: 503, headers: { 'Content-Type': 'application/json' } });
    }

    let body: { email?: string; password?: string };
    try {
        body = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const email = (body.email || '').trim().toLowerCase();
    const password = body.password || '';

    const emailOk = env.ADMIN_EMAIL
        ? await safeEqual(email, env.ADMIN_EMAIL.trim().toLowerCase())
        : true; // ADMIN_EMAIL 미설정 시 비밀번호만 검사
    const passwordOk = await safeEqual(password, env.ADMIN_PASSWORD);

    if (!emailOk || !passwordOk) {
        return new Response(JSON.stringify({ error: 'Имэйл эсвэл нууц үг буруу байна.' }), {
            status: 401, headers: { 'Content-Type': 'application/json' },
        });
    }

    const exp = Date.now() + SESSION_TTL_MS;
    const token = await signSession(env.ADMIN_PASSWORD, exp);

    return new Response(JSON.stringify({ ok: true }), {
        headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': `dt_admin=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`,
        },
    });
};
