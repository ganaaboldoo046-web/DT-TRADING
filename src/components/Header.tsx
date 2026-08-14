import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu, Moon, Sun } from 'lucide-react';
import Logo from './Logo';
import SideMenu from './SideMenu';
import DesktopHeader from './DesktopHeader';
import Ticker from './Ticker';
import { useTheme } from '../theme';
import { getUser } from '../utils/storage';

interface HeaderProps {
    /** 뒤로가기 버튼 표시 (상세 페이지 등) */
    showBack?: boolean;
    /** 로고 대신/옆에 표시할 타이틀 */
    title?: string;
    /** 로고 숨김 */
    hideLogo?: boolean;
}

export default function Header({ showBack = false, title = '', hideLogo = false }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userInitial, setUserInitial] = useState('');
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const syncUser = () => {
            const user = getUser();
            setUserInitial(user?.name ? user.name.slice(0, 1).toUpperCase() : '');
        };
        syncUser();
        window.addEventListener('userUpdated', syncUser);
        return () => window.removeEventListener('userUpdated', syncUser);
    }, []);

    return (
        <>
            {/* PC 디자인 헤더 + 티커 (lg 이상) */}
            <DesktopHeader />
            <Ticker />

            {/* 모바일 디자인 헤더 (lg 미만) */}
            <header className="lg:hidden sticky top-0 z-30 bg-surface border-b border-line px-4 py-3 flex items-center gap-3">
                {showBack && (
                    <button
                        onClick={() => navigate(-1)}
                        aria-label="Буцах"
                        className="w-9 h-9 flex-none border-0 rounded-[10px] bg-line text-ink flex items-center justify-center active:scale-95 transition-transform"
                    >
                        <ArrowLeft size={17} strokeWidth={2.5} />
                    </button>
                )}
                {!hideLogo && <Logo />}
                <div className="flex-1 text-[15.5px] font-extrabold tracking-tight truncate">{title}</div>
                {userInitial && (
                    <button
                        onClick={() => navigate('/profile')}
                        aria-label="Профайл"
                        className="w-9 h-9 flex-none border-0 rounded-full bg-tint text-primary text-[13px] font-extrabold active:scale-95 transition-transform"
                    >
                        {userInitial}
                    </button>
                )}
                <button
                    onClick={toggleTheme}
                    aria-label="Горим солих"
                    className="w-9 h-9 flex-none border-0 rounded-[10px] bg-line text-ink flex items-center justify-center active:scale-95 transition-transform"
                >
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                </button>
                <button
                    onClick={() => setIsMenuOpen(true)}
                    aria-label="Цэс"
                    className="w-9 h-9 flex-none border-0 rounded-[10px] bg-line text-ink flex items-center justify-center active:scale-95 transition-transform"
                >
                    <Menu size={17} />
                </button>
            </header>

            <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </>
    );
}
