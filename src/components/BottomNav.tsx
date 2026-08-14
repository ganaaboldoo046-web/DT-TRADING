import { Link, useLocation } from 'react-router-dom';
import { Heart, Home, Search, User } from 'lucide-react';

const TABS = [
    { path: '/', label: 'Нүүр', Icon: Home },
    { path: '/search', label: 'Хайх', Icon: Search },
    { path: '/saved', label: 'Хадгалсан', Icon: Heart },
    { path: '/profile', label: 'Профайл', Icon: User },
];

export default function BottomNav() {
    const location = useLocation();

    return (
        <nav className="lg:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-30 bg-surface border-t border-line px-3 pt-2 pb-[18px] flex box-border">
            {TABS.map(({ path, label, Icon }) => {
                const active = location.pathname === path;
                return (
                    <Link
                        key={path}
                        to={path}
                        className={`flex-1 flex flex-col items-center gap-[3px] min-h-12 py-1.5 ${active ? 'text-primary' : 'text-muted-2'}`}
                    >
                        <Icon size={19} strokeWidth={active ? 2.5 : 2} fill={active && path === '/saved' ? 'currentColor' : 'none'} />
                        <span className="text-[10.5px] font-bold">{label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
