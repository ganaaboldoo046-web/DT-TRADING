import { Link } from 'react-router-dom';
import Logo from './Logo';
import { COMPANY } from '../constants/company';

const COLUMNS = [
    {
        title: 'КОМПАНИ',
        links: [
            { label: 'Бидний тухай', to: '/about' },
            { label: 'Түгээмэл асуулт', to: '/profile' },
            { label: 'Холбоо барих', to: '/about' },
        ],
    },
    {
        title: 'ЭРХ ЗҮЙ',
        links: [
            { label: 'Үйлчилгээний нөхцөл', to: '/terms' },
            { label: 'Нууцлалын бодлого', to: '/privacy' },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="bg-surface border-t border-line px-4 pt-7 pb-[110px]">
            <Logo plain />
            <div className="mt-3 text-[12.5px] leading-[1.7] text-muted">010 7755 0118 / 010 8460 5703</div>
            <div className="mt-6 grid grid-cols-2 gap-[22px]">
                {COLUMNS.map(col => (
                    <div key={col.title}>
                        <div className="text-[11.5px] font-extrabold tracking-[0.08em] text-ink mb-3">{col.title}</div>
                        <div className="flex flex-col gap-2.5 items-start">
                            {col.links.map(link => (
                                <Link
                                    key={link.label}
                                    to={link.to}
                                    className="text-[13px] font-medium text-muted hover:text-ink transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-[26px] pt-[18px] border-t border-line text-[11.5px] text-muted-2">
                {COMPANY.copyright}
            </div>
        </footer>
    );
}
