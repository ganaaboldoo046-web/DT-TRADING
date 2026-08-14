import { Link } from 'react-router-dom';
import { COMPANY } from '../constants/company';

interface LogoProps {
    /** true면 홈으로 가는 링크로 감싸지 않음 (메뉴/시트 내부용) */
    plain?: boolean;
    size?: 'sm' | 'md';
}

export default function Logo({ plain = false, size = 'md' }: LogoProps) {
    const box = size === 'md' ? 'w-[30px] h-[30px] text-[14px]' : 'w-7 h-7 text-[13px]';
    const title = size === 'md' ? 'text-[17px]' : 'text-[15px]';

    const content = (
        <span className="flex items-center gap-[9px]">
            <span className={`${box} rounded-lg bg-primary text-white flex items-center justify-center font-extrabold tracking-tight`}>
                {COMPANY.logoShort}
            </span>
            <span className="flex flex-col leading-none">
                <span className={`${title} font-extrabold tracking-tight text-ink`}>{COMPANY.name}</span>
                <span className="mt-[3px] text-[8px] font-bold tracking-[0.16em] text-muted-2">{COMPANY.tagline}</span>
            </span>
        </span>
    );

    if (plain) return content;
    return <Link to="/" className="inline-block">{content}</Link>;
}
