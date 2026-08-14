// /api/* 전체에 적용되는 인증 미들웨어.
// 공개 엔드포인트를 명시적으로 나열하고, 나머지는 전부 관리자 세션을 요구한다.
// (새 엔드포인트를 추가하면 기본적으로 잠긴 상태가 되도록 화이트리스트 방식을 쓴다.)
import { readSessionCookie, verifySession } from './admin_login';

interface Env {
    ADMIN_PASSWORD?: string;
}

const JSON_HEADERS = { 'Content-Type': 'application/json' };

export const onRequest: PagesFunction<Env> = async (context) => {
    const { request, env, next } = context;
    const url = new URL(request.url);
    // "/api/products" -> "products", "/api/images/x.webp" -> "images/x.webp"
    const route = url.pathname.replace(/^\/api\//, '');
    const method = request.method.toUpperCase();

    if (isPublic(route, method, url)) {
        return next();
    }

    if (!env.ADMIN_PASSWORD) {
        return new Response(JSON.stringify({
            error: 'ADMIN_PASSWORD 환경변수가 설정되지 않아 관리자 기능이 비활성화되어 있습니다.',
        }), { status: 503, headers: JSON_HEADERS });
    }

    const admin = await verifySession(env.ADMIN_PASSWORD, readSessionCookie(request));
    if (!admin) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: JSON_HEADERS });
    }

    return next();
};

function isPublic(route: string, method: string, url: URL): boolean {
    // CORS preflight 등은 통과
    if (method === 'OPTIONS' || method === 'HEAD') return true;

    // 로그인/세션 확인/로그아웃은 자체적으로 처리
    if (route === 'admin_login' || route === 'admin_me') return true;

    // R2 이미지 서빙
    if (route.startsWith('images/')) return true;

    if (method === 'GET') {
        // 공개 읽기
        if (['products', 'categories', 'banners', 'exchange_rate', 'reviews_list'].includes(route)) return true;
        // 예약 목록: 본인 userId 조회만 공개, 전체 목록(파라미터 없음)은 관리자 전용
        if (route === 'reservations_list') return !!url.searchParams.get('userId');
        return false;
    }

    if (method === 'POST') {
        // 고객이 직접 제출하는 것들만 공개
        return ['reservations_create', 'reviews_create'].includes(route);
    }

    return false;
}
