import { Link } from 'react-router-dom';
import Logo from './Logo';
import { COMPANY } from '../constants/company';

const COLUMNS = [
    {
        title: 'КОМПАНИ',
        links: [
            { label: 'Бидний тухай', to: '/about' },
            { label: 'Бүх машин', to: '/search' },
            { label: 'Категори', to: '/categories' },
        ],
    },
    {
        title: 'ЭРХ ЗҮЙ',
        links: [
            { label: 'Үйлчилгээний нөхцөл', to: '/terms' },
            { label: 'Нууцлалын бодлого', to: '/privacy' },
        ],
    },
    {
        title: 'ХОЛБОО БАРИХ',
        links: [
            { label: '010 7755 0118', to: '/about' },
            { label: '010 8460 5703', to: '/about' },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="bg-surface border-t border-line px-4 pt-7 pb-[110px] lg:px-6 lg:pt-12 lg:pb-14">
            <div className="max-w-[1280px] mx-auto grid grid-cols-2 gap-[22px] lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-8">
                <div className="col-span-2 lg:col-span-1">
                    <Logo plain />
                    <div className="mt-3 lg:mt-3.5 text-[12.5px] leading-[1.7] text-muted">
                        010 7755 0118<br />010 8460 5703
                    </div>
                </div>
                {COLUMNS.map(col => (
                    <div key={col.title}>
                        <div className="text-[11.5px] lg:text-xs font-extrabold tracking-[0.08em] text-ink mb-3 lg:mb-3.5">
                            {col.title}
                        </div>
                        <div className="flex flex-col gap-2.5 lg:gap-[9px] items-start">
                            {col.links.map(link => (
                                <Link
                                    key={link.label}
                                    to={link.to}
                                    className="text-[13px] font-medium text-muted hover:text-primary transition-colors text-left"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="max-w-[1280px] mx-auto mt-[26px] lg:mt-10 pt-[18px] lg:pt-[22px] border-t border-line text-[11.5px] lg:text-xs text-muted-2">
                {COMPANY.copyright}
            </div>
        </footer>
    );
}
