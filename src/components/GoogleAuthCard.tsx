import { useGoogleLogin } from '@react-oauth/google';
import { setUser } from '../utils/storage';
import { isGoogleAuthConfigured } from '../constants/googleAuth';

/**
 * useGoogleLogin은 GoogleOAuthProvider 안에서만 안전하게 실행 가능합니다.
 * Client ID가 설정되지 않았을 경우 useGoogleLogin을 호출하면 예외가 발생하므로
 * Inner 컴포넌트로 분리하여 isGoogleAuthConfigured일 때만 렌더링합니다.
 */
function GoogleAuthButtons() {
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
    );
}

export default function GoogleAuthCard() {
    if (!isGoogleAuthConfigured) {
        return (
            <div className="bg-surface border border-line rounded-2xl px-5 py-6">
                <div className="text-base font-extrabold tracking-tight">Автомашинаа сонгоод захиалга өгөөрэй</div>
                <div className="mt-1.5 text-[13px] leading-relaxed text-muted">
                    Нэвтрэхгүйгээр ч зар үзэх, хадгалах, захиалга өгөх боломжтой.
                </div>
            </div>
        );
    }

    return (
        <div className="bg-surface border border-line rounded-2xl px-5 py-6">
            <div className="text-base font-extrabold tracking-tight">Нэвтэрч захиалгаа хянаарай</div>
            <div className="mt-1.5 text-[13px] leading-relaxed text-muted">
                Хадгалсан зар, захиалгын төлөв нэг дор.
            </div>
            <GoogleAuthButtons />
            <p className="mt-3.5 text-[11.5px] text-muted-2">
                Google хаягаараа нэвтэрнэ. Үйлчилгээний нөхцөл болон нууцлалын бодлогыг зөвшөөрч байна.
            </p>
        </div>
    );
}

