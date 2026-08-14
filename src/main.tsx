import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './theme.tsx'
import { GOOGLE_CLIENT_ID, isGoogleAuthConfigured } from './constants/googleAuth'

if (!isGoogleAuthConfigured) {
  console.warn(
    '[DT TRADING] VITE_GOOGLE_CLIENT_ID가 설정되지 않아 Google 로그인 기능이 비활성화됩니다. ' +
    'Cloudflare Pages의 환경변수에 값을 넣고 재배포하세요. (사이트의 나머지 기능은 정상 동작합니다.)'
  );
}

const app = (
  <ThemeProvider>
    <App />
  </ThemeProvider>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* clientId가 없을 때 Provider를 씌우면 Google 스크립트가 예외를 던지므로 감싸지 않는다 */}
    {isGoogleAuthConfigured
      ? <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>{app}</GoogleOAuthProvider>
      : app}
  </StrictMode>,
)
