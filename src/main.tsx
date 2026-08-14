import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './theme.tsx'

// 기본값을 두지 않는다. 값이 없을 때 다른 프로젝트의 클라이언트 ID로 조용히 넘어가면
// 로그인이 왜 실패하는지 알 수 없게 된다.
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

if (!GOOGLE_CLIENT_ID) {
  console.warn(
    '[DT TRADING] VITE_GOOGLE_CLIENT_ID가 설정되지 않아 Google 로그인이 동작하지 않습니다. ' +
    'Cloudflare Pages의 환경변수에 값을 넣고 재배포하세요.'
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
