// Үнийн задаргаа(가격 상세 내역) 계산에 쓰는 공통 설정.
// settings 테이블에 저장. GET 공개 / POST 관리자 전용(미들웨어).
// 특별소비세는 서버 설정이 아니라 프론트의 공식 세율표(src/utils/pricing.ts)로 자동 계산한다.

interface Env {
    DB: D1Database;
}

const KEY = 'pricing_settings';

export interface PricingSettings {
    serviceFee: number;   // Монгол үйлчилгээний шимтгэл (₮)
    transport: number;    // Тээврийн зардал (₮)
    customsPct: number;   // Гаалийн татвар (%)
    vatPct: number;       // НӨАТ (%)
}

const DEFAULTS: PricingSettings = {
    serviceFee: 800_000,
    transport: 5_392_500,
    customsPct: 5,
    vatPct: 10,
};

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
    try {
        const row = await env.DB.prepare('SELECT value FROM settings WHERE key = ?').bind(KEY).first();
        let settings = DEFAULTS;
        if (row?.value) {
            try {
                settings = { ...DEFAULTS, ...JSON.parse(row.value as string) };
            } catch { /* 손상된 값이면 기본값 */ }
        }
        return new Response(JSON.stringify(settings), {
            headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' },
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500 });
    }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
    try {
        const body = await request.json() as Partial<PricingSettings>;
        const next: PricingSettings = {
            serviceFee: sanitize(body.serviceFee, DEFAULTS.serviceFee),
            transport: sanitize(body.transport, DEFAULTS.transport),
            customsPct: sanitize(body.customsPct, DEFAULTS.customsPct),
            vatPct: sanitize(body.vatPct, DEFAULTS.vatPct),
        };
        await env.DB.prepare(
            "INSERT INTO settings (key, value, updated_at) VALUES (?, ?, strftime('%s','now')) " +
            'ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at'
        ).bind(KEY, JSON.stringify(next)).run();
        return new Response(JSON.stringify({ ok: true, ...next }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500 });
    }
};

function sanitize(v: unknown, fallback: number): number {
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? n : fallback;
}
