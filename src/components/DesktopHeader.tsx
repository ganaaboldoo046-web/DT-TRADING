import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Moon, Search as SearchIcon, Sun, X } from 'lucide-react';
import { useTheme } from '../theme';
import { useExchangeRate } from '../hooks/useExchangeRate';
import { clearUser, getUser } from '../utils/storage';
import type { AppUser } from '../utils/storage';
import { COMPANY } from '../constants/company';

const NAV = [
    { to: '/', label: 'Нүүр' },
    { to: '/search', label: 'Бүх машин' },
    { to: '/about', label: 'Бидний тухай' },
];

const USER_MENU = [
    { to: '/profile', label: 'Профайл' },
    { to: '/saved', label: 'Хадгалсан зар' },
];

/** PC 디자인의 헤더 (1280px 컨테이너, 68px 높이). lg 미만에서는 숨김. */
export default function DesktopHeader({ onOpenAuth }: { onOpenAuth?: () => void }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const rate = useExchangeRate();
    const [query, setQuery] = useState('');
    const [user, setUserState] = useState<AppUser | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const sync = () => setUserState(getUser());
        sync();
        window.addEventListener('userUpdated', sync);
        return () => window.removeEventListener('userUpdated', sync);
    }, []);

    // 바깥을 클릭하면 사용자 드롭다운을 닫는다
    useEffect(() => {
        if (!menuOpen) return;
        const onDown = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
        };
        document.addEventListener('mousedown', onDown);
        return () => document.removeEventListener('mousedown', onDown);
    }, [menuOpen]);

    const runSearch = () => {
        navigate(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : '/search');
    };

    return (
        <header className="hidden lg:block sticky top-0 z-40 bg-surface border-b border-line">
            <div className="max-w-[1280px] mx-auto px-6 h-[68px] flex items-center gap-5">
                <Link to="/" className="flex items-center gap-[9px] flex-none">
                    <span className="w-[38px] h-[38px] rounded-lg bg-primary text-white flex items-center justify-center text-[17px] font-extrabold tracking-tight">
                        {COMPANY.logoShort}
                    </span>
                    <span className="flex flex-col leading-none">
                        <span className="text-[21px] font-extrabold tracking-tight text-ink">{COMPANY.name}</span>
                        <span className="mt-[3px] text-[11px] font-bold tracking-[0.16em] text-muted-2 hidden xl:block">
                            АВТО МАШИН ХУДАЛДАА
                        </span>
                    </span>
                </Link>

                <nav className="flex items-center gap-0.5 flex-none">
                    {NAV.map(item => {
                        const active = location.pathname === item.to;
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={`px-[9px] py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${active ? 'font-extrabold text-ink' : 'font-semibold text-muted hover:text-ink'}`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-2.5 flex-1 min-w-0 justify-end">
                    <div className="flex items-center gap-2 h-10 px-3.5 rounded-[10px] bg-surface-2 border border-line w-full max-w-[280px] min-w-0">
                        <button onClick={runSearch} aria-label="Хайх" className="border-0 bg-transparent p-0 text-muted-2 flex-none">
                            <SearchIcon size={15} />
                        </button>
                        <input
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') runSearch(); }}
                            placeholder="Машин хайх"
                            className="flex-1 min-w-0 border-0 outline-none bg-transparent text-[13px] font-medium text-ink placeholder:text-muted-2"
                        />
                        {query && (
                            <button onClick={() => setQuery('')} aria-label="Цэвэрлэх" className="border-0 bg-transparent p-0 text-muted-2 flex-none">
                                <X size={13} />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={toggleTheme}
                        aria-label="Горим солих"
                        className="w-10 h-10 flex-none border border-line rounded-[10px] bg-surface text-ink flex items-center justify-center"
                    >
                        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    </button>

                    {user ? (
                        <div className="relative flex-none" ref={menuRef}>
                            <button
                                onClick={() => setMenuOpen(o => !o)}
                                className="flex items-center gap-2 h-10 pl-1.5 pr-3 border border-line rounded-[10px] bg-surface"
                            >
                                <span className="w-7 h-7 rounded-full bg-tint text-primary flex items-center justify-center text-[12.5px] font-extrabold overflow-hidden">
                                    {user.avatar
                                        ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                        : user.name.slice(0, 1).toUpperCase()}
                                </span>
                                <span className="text-[13.5px] font-bold text-ink whitespace-nowrap max-w-[120px] truncate">{user.name}</span>
                                <ChevronDown size={11} className="text-muted-2" />
                            </button>
                            {menuOpen && (
                                <div className="absolute top-12 right-0 w-[190px] bg-surface border border-line rounded-xl shadow-2xl p-1.5 z-50 flex flex-col">
                                    {USER_MENU.map(m => (
                                        <button
                                            key={m.to}
                                            onClick={() => { setMenuOpen(false); navigate(m.to); }}
                                            className="h-10 px-3 rounded-lg text-left text-[13.5px] font-bold text-ink hover:bg-surface-2"
                                        >
                                            {m.label}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => { setMenuOpen(false); clearUser(); }}
                                        className="h-10 px-3 rounded-lg text-left text-[13.5px] font-bold text-danger hover:bg-surface-2"
                                    >
                                        Гарах
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => (onOpenAuth ? onOpenAuth() : navigate('/profile'))}
                            className="h-10 px-3.5 flex-none border border-line rounded-[10px] bg-surface text-[13.5px] font-bold text-ink whitespace-nowrap"
                        >
                            Нэвтрэх
                        </button>
                    )}

                    {rate !== null && (
                        <div className="flex items-center gap-2.5 h-10 px-4 rounded-[10px] bg-primary text-white whitespace-nowrap flex-none">
                            <span className="text-[13px] font-bold">1₩ = {rate}₮</span>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
