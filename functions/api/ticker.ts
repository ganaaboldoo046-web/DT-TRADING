// 데스크탑 헤더 아래 검정 띠배너(티커) 문구.
// settings 테이블의 'ticker_items' 키에 JSON 배열로 저장한다.
// GET은 공개, POST는 미들웨어에 의해 관리자 전용.

interface Env {
    DB: D1Database;
}

const KEY = 'ticker_items';

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
    try {
        const row = await env.DB.prepare('SELECT value FROM settings WHERE key = ?').bind(KEY).first();
        let items: string[] = [];
        if (row?.value) {
            try {
                const parsed = JSON.parse(row.value as string);
                if (Array.isArray(parsed)) items = parsed.filter(v => typeof v === 'string');
            } catch { /* 손상된 값이면 빈 배열 */ }
        }
        return new Response(JSON.stringify({ items }), {
            headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' },
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500 });
    }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
    try {
        const body = await request.json() as { items?: unknown };
        if (!Array.isArray(body.items) || !body.items.every(v => typeof v === 'string')) {
            return new Response(JSON.stringify({ error: 'items must be a string array' }), { status: 400 });
        }
        const items = body.items.map(s => s.trim()).filter(Boolean).slice(0, 20);
        await env.DB.prepare(
            "INSERT INTO settings (key, value, updated_at) VALUES (?, ?, strftime('%s','now')) " +
            'ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at'
        ).bind(KEY, JSON.stringify(items)).run();
        return new Response(JSON.stringify({ ok: true, items }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500 });
    }
};
