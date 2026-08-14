import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, X } from 'lucide-react';
import Logo from './Logo';
import { COMPANY } from '../constants/company';
import { clearUser, getUser } from '../utils/storage';
import type { AppUser } from '../utils/storage';

interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const MENU_GROUPS = [
    {
        title: 'МЕНЮ',
        items: [
            { label: 'Нүүр', to: '/' },
            { label: 'Бүх машин', to: '/search' },
            { label: 'Хэрэглэгчийн хуудас', to: '/profile' },
            { label: 'Бидний тухай', to: '/about' },
        ],
    },
];

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
    const navigate = useNavigate();
    const [user, setUserState] = useState<AppUser | null>(null);

    useEffect(() => {
        const syncUser = () => setUserState(getUser());
        syncUser();
        window.addEventListener('userUpdated', syncUser);
        return () => window.removeEventListener('userUpdated', syncUser);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    const go = (to: string) => {
        onClose();
        navigate(to);
    };

    return (
        <div className="fixed inset-0 z-[80] bg-black/70 flex items-start justify-center" onClick={onClose}>
            <div
                className="w-[430px] max-w-full max-h-full overflow-y-auto bg-surface flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* 헤더 */}
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-line">
                    <Logo plain />
                    <button
                        onClick={onClose}
                        aria-label="Хаах"
                        className="w-9 h-9 border-0 rounded-[10px] bg-line text-muted flex items-center justify-center"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* 로그인 영역 */}
                <div className="p-4">
                    {user ? (
                        <div className="flex items-center gap-3 py-1.5 px-0.5">
                            <div className="w-11 h-11 rounded-full bg-tint text-primary flex items-center justify-center text-base font-extrabold overflow-hidden">
                                {user.avatar
                                    ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                    : user.name.slice(0, 1).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[15px] font-extrabold">{user.name}</div>
                                <div className="mt-0.5 text-[12.5px] text-muted truncate">{user.email}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-[9px]">
                            <button
                                onClick={() => go('/profile')}
                                className="flex-1 h-12 border-0 rounded-xl bg-primary text-white text-sm font-bold active:scale-95 transition-transform"
                            >
                                Нэвтрэх
                            </button>
                            <button
                                onClick={() => go('/profile')}
                                className="flex-1 h-12 border border-line rounded-xl bg-surface text-ink text-sm font-bold active:scale-95 transition-transform"
                            >
                                Бүртгүүлэх
                            </button>
                        </div>
                    )}
                </div>

                {/* 메뉴 그룹 (로그인 시 내 메뉴 추가) */}
                {[
                    ...MENU_GROUPS,
                    ...(user ? [{
                        title: 'МИНИЙ',
                        items: [
                            { label: 'Хадгалсан зар', to: '/saved' },
                            { label: 'Миний захиалга', to: '/profile' },
                        ],
                    }] : []),
                ].map(group => (
                    <div key={group.title} className="px-4 pt-2 pb-1">
                        <div className="text-[11.5px] font-extrabold tracking-[0.08em] text-muted-2 py-2 px-0.5">
                            {group.title}
                        </div>
                        <div className="flex flex-col">
                            {group.items.map(item => (
                                <button
                                    key={item.label}
                                    onClick={() => go(item.to)}
                                    className="w-full min-h-[50px] flex items-center justify-between px-0.5 border-0 border-b border-surface-2 bg-transparent text-[14.5px] font-bold text-ink"
                                >
                                    <span>{item.label}</span>
                                    <ChevronRight size={15} className="text-muted-4" />
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

                {/* 로그아웃 */}
                {user && (
                    <div className="px-4 pt-2">
                        <button
                            onClick={() => { clearUser(); onClose(); }}
                            className="w-full min-h-[50px] flex items-center justify-between px-0.5 border-0 border-b border-surface-2 bg-transparent text-[14.5px] font-bold text-danger"
                        >
                            <span>Гарах</span>
                            <ChevronRight size={15} className="text-muted-4" />
                        </button>
                    </div>
                )}

                {/* 연락처 카드 */}
                <div className="m-4 p-5 bg-black rounded-2xl">
                    <div className="text-[11.5px] font-bold tracking-[0.1em] text-white/50">{COMPANY.name}</div>
                    <div className="mt-2.5 text-base font-extrabold text-white">{COMPANY.phoneMain}</div>
                    <div className="mt-0.5 text-[13.5px] font-bold text-white/[.62]">{COMPANY.phoneSub}</div>
                    <div className="mt-3 text-xs leading-relaxed text-white/[.62]">{COMPANY.address}</div>
                </div>
            </div>
        </div>
    );
}
