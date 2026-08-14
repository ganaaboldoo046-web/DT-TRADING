import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { clearUser, getUser, setUser as persistUser } from '../utils/storage';
import type { AppUser } from '../utils/storage';

interface Order {
    id: number;
    product_name: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    created_at: number;
    phone?: string;
}

const ORDER_STATUS: Record<Order['status'], { label: string; cls: string }> = {
    pending: { label: 'Хүлээгдэж буй', cls: 'bg-tint text-primary' },
    confirmed: { label: 'Баталгаажсан', cls: 'bg-tint text-primary' },
    completed: { label: 'Дууссан', cls: 'bg-line text-ink-2' },
    cancelled: { label: 'Цуцлагдсан', cls: 'bg-line text-muted' },
};

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUserState] = useState<AppUser | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [ordersOpen, setOrdersOpen] = useState(false);

    useEffect(() => {
        const sync = () => setUserState(getUser());
        sync();
        window.addEventListener('userUpdated', sync);
        return () => window.removeEventListener('userUpdated', sync);
    }, []);

    useEffect(() => {
        if (!user?.email) {
            setOrders([]);
            return;
        }
        const fetchOrders = async () => {
            try {
                const res = await fetch(`/api/reservations_list?userId=${encodeURIComponent(user.email)}`);
                if (res.ok) setOrders(await res.json() as Order[]);
            } catch (e) {
                console.error('Failed to fetch orders', e);
            }
        };
        fetchOrders();
    }, [user]);

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const data = await res.json();
                persistUser({
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

    const menuItems = [
        { label: 'Миний захиалга', action: () => user ? setOrdersOpen(o => !o) : login() },
        { label: 'Хадгалсан зар', action: () => navigate('/saved') },
        { label: 'Бидний тухай', action: () => navigate('/about') },
        { label: 'Үйлчилгээний нөхцөл', action: () => navigate('/terms') },
        ...(user ? [{ label: 'Гарах', action: () => clearUser(), danger: true }] : []),
    ] as { label: string; action: () => void; danger?: boolean }[];

    return (
        <div className="min-h-screen bg-app text-ink">
            <Header title="Профайл" hideLogo />
            <main className="px-4 pt-4 pb-24">
                {user ? (
                    <div className="bg-surface border border-line rounded-2xl p-5 flex items-center gap-3.5">
                        <div className="w-[52px] h-[52px] rounded-full bg-tint text-primary flex items-center justify-center text-[19px] font-extrabold overflow-hidden">
                            {user.avatar
                                ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                : user.name.slice(0, 1).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-base font-extrabold">{user.name}</div>
                            <div className="mt-[3px] text-[12.5px] text-muted truncate">{user.email}</div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-surface border border-line rounded-2xl px-5 py-6">
                        <div className="text-base font-extrabold tracking-tight">Нэвтэрч захиалгаа хянаарай</div>
                        <div className="mt-1.5 text-[13px] leading-relaxed text-muted">Хадгалсан зар, захиалгын төлөв нэг дор.</div>
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
                )}

                {/* 메뉴 리스트 */}
                <div className="mt-3 bg-surface border border-line rounded-2xl overflow-hidden">
                    {menuItems.map((m, i) => (
                        <button
                            key={m.label}
                            onClick={m.action}
                            className={`w-full min-h-[52px] flex items-center justify-between px-[18px] border-0 bg-transparent text-sm font-bold ${i < menuItems.length - 1 ? 'border-b border-surface-2' : ''} ${m.danger ? 'text-danger' : 'text-ink'}`}
                        >
                            <span>{m.label}</span>
                            <ChevronRight size={15} className="text-muted-4" />
                        </button>
                    ))}
                </div>

                {/* 주문 내역 */}
                {user && ordersOpen && (
                    <div className="mt-3">
                        <div className="text-[13.5px] font-extrabold px-1 pb-2.5">Миний захиалга</div>
                        {orders.length === 0 ? (
                            <div className="bg-surface border border-line rounded-2xl py-10 text-center text-[13px] text-muted">
                                Захиалгын түүх байхгүй байна.
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2.5">
                                {orders.map(order => {
                                    const st = ORDER_STATUS[order.status] || ORDER_STATUS.pending;
                                    return (
                                        <div key={order.id} className="bg-surface border border-line rounded-2xl p-4">
                                            <div className="flex justify-between items-start gap-3">
                                                <div className="text-sm font-bold">{order.product_name}</div>
                                                <span className={`flex-none text-[11px] font-bold px-2 py-1 rounded-full ${st.cls}`}>
                                                    {st.label}
                                                </span>
                                            </div>
                                            <div className="mt-2 text-xs text-muted">
                                                {new Date(order.created_at * 1000).toLocaleDateString()}
                                                {order.phone ? ` · ${order.phone}` : ''}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </main>
            <BottomNav />
        </div>
    );
}
