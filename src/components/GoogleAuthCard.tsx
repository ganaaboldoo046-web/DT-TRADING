import { useGoogleLogin } from '@react-oauth/google';
import { setUser } from '../utils/storage';

/**
 * 로그아웃 상태에서 보여주는 Google 로그인 카드.
 * useGoogleLogin은 GoogleOAuthProvider 안에서만 쓸 수 있으므로,
 * 클라이언트 ID가 설정된 경우에만 이 컴포넌트를 렌더링해야 한다.
 */
export default function GoogleAuthCard() {
    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                if (!res.ok) throw new Error('userinfo request failed');
                const data = await res.json();
                setUser({
                    email: data.email,
                    name: data.name,
                    avatar: data.picture,
                    googleId: data.sub,
                });
            } catch (e) {
                console.error('Failed to fetch user info:', e);
                alert('Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.');
            }
        },
        onError: () => alert('Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.'),
    });

    return (
        <div className="bg-surface border border-line rounded-2xl px-5 py-6">
            <div className="text-base font-extrabold tracking-tight">Нэвтэрч захиалгаа хянаарай</div>
            <div className="mt-1.5 text-[13px] leading-relaxed text-muted">
                Хадгалсан зар, захиалгын төлөв нэг дор.
            </div>
            <div className="mt-4 flex gap-[9px]">
                <button
                    onClick={() => login()}
                    className="flex-1 h-12 border-0 rounded-xl bg-primary text-white text-sm font-bold active:scale-95 transition-transform"
                >
                    Нэвтрэх
                </button>
                <button
                    onClick={() => login()}
                    className="flex-1 h-12 border border-line rounded-xl bg-surface text-ink text-sm font-bold active:scale-95 transition-transform"
                >
                    Бүртгүүлэх
                </button>
            </div>
            <p className="mt-3.5 text-[11.5px] text-muted-2">
                Google хаягаараа нэвтэрнэ. Үйлчилгээний нөхцөл болон нууцлалын бодлогыг зөвшөөрч байна.
            </p>
        </div>
    );
}
