import { Link } from 'react-router-dom';
import { COMPANY } from '../constants/company';

interface LogoProps {
    /** true면 홈으로 가는 링크로 감싸지 않음 (메뉴/시트 내부용) */
    plain?: boolean;
    size?: 'sm' | 'md';
}

/**
 * 브랜드 로고. 라이트 모드에선 남색 글자 로고, 다크 모드에선 흰 글자 로고를 쓴다.
 * (public/logo-light.png / logo-dark.png — 관리자가 준 원본을 120px 높이로 최적화한 것)
 */
export default function Logo({ plain = false, size = 'md' }: LogoProps) {
    const height = size === 'md' ? 'h-10' : 'h-8';

    const content = (
        <span className="inline-flex items-center">
            <img src="/logo-light.png" alt={COMPANY.name} className={`${height} w-auto block dark:hidden`} />
            <img src="/logo-dark.png" alt={COMPANY.name} className={`${height} w-auto hidden dark:block`} />
        </span>
    );

    if (plain) return content;
    return <Link to="/" className="inline-block">{content}</Link>;
}
