// GET: 현재 브라우저가 관리자 세션인지 확인 (프론트 가드용)
// POST: 로그아웃 (세션 쿠키 제거)
import { readSessionCookie, verifySession } from './admin_login';

interface Env {
    ADMIN_PASSWORD?: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
    const admin = env.ADMIN_PASSWORD
        ? await verifySession(env.ADMIN_PASSWORD, readSessionCookie(request))
        : false;
    return new Response(JSON.stringify({ admin }), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
};

export const onRequestPost: PagesFunction<Env> = async () => {
    return new Response(JSON.stringify({ ok: true }), {
        headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': 'dt_admin=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0',
        },
    });
};
