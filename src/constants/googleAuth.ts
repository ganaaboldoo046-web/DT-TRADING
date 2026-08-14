// Google 로그인 설정. 값이 없으면 로그인 UI 자체를 렌더링하지 않는다.
// 빈 clientId로 GoogleOAuthProvider / useGoogleLogin을 초기화하면
// "Missing required parameter client_id"가 던져져 앱 전체가 죽는다.
export const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();

export const isGoogleAuthConfigured = GOOGLE_CLIENT_ID.length > 0;
