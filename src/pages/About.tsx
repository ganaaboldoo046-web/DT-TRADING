import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import { useReveal } from '../hooks/useReveal';
import { COMPANY } from '../constants/company';

const SERVICES = [
    'Чанартай хуучин автомашины худалдаа',
    'Автомашин сонгох зөвлөгөө',
    'Тээврийн хэрэгслийн дэлгэрэнгүй мэдээлэл',
    'Худалдан авалтын үйл явцын дэмжлэг',
    'Хэрэглэгчийн хэрэгцээ, төсөвт тохирсон автомашины санал',
];

const REASONS = [
    { title: 'Ил тод мэдээлэл', body: 'Автомашины талаарх шаардлагатай мэдээллийг хэрэглэгчдэд ойлгомжтой, нээлттэй хүргэнэ.', image: '/about.jpg' },
    { title: 'Найдвартай зөвлөгөө', body: 'Таны хэрэгцээ, хэрэглээ болон төсөвт тохирсон автомашиныг сонгоход тусална.' },
    { title: 'Хариуцлагатай үйлчилгээ', body: 'Хэрэглэгч бүрд анхаарал хандуулж, худалдан авалтын бүх үе шатанд шуурхай үйлчилнэ.' },
    { title: 'Хэрэглэгчийн сэтгэл ханамж', body: 'Бидний зорилго бол зөвхөн автомашин худалдах бус, хэрэглэгчтэй урт хугацааны итгэлцэл бий болгох явдал юм.' },
];

const STRIP = [
    { label: 'ЗУРАГ 01', h: 180, w: 140, lgH: 260, lgW: 200, image: '/about.jpg' },
    { label: 'ЗУРАГ 02', h: 230, w: 175, lgH: 330, lgW: 250, image: '/629659718_930285069576307_7594762200449531737_n.jpg' },
    { label: 'ЗУРАГ 03', h: 195, w: 205, lgH: 280, lgW: 295 },
    { label: 'ЗУРАГ 04', h: 245, w: 170, lgH: 350, lgW: 245 },
    { label: 'ЗУРАГ 05', h: 170, w: 215, lgH: 245, lgW: 310 },
    { label: 'ЗУРАГ 06', h: 210, w: 160, lgH: 300, lgW: 230 },
];

const STATS = [
    { label: 'Бэлэн зар', value: '3,796', tint: 'rgba(255,26,26,0.10)' },
    { label: 'Үзлэгийн цэг', value: '200', tint: 'rgba(90,140,255,0.12)' },
    { label: 'Баталгаа', value: '1 жил', tint: 'rgba(60,200,140,0.12)' },
    { label: 'Захиалгын хариу', value: '1 цаг', tint: 'rgba(255,180,60,0.12)' },
];

export default function About() {
    useReveal();

    return (
        <div className="min-h-screen bg-app text-ink">
            <Header />
            <main className="pb-8 lg:pb-24">
                {/* 히어로 */}
                <section className="max-w-[1180px] mx-auto px-4 lg:px-6 pt-10 lg:pt-24">
                    <div data-reveal="1" className="text-[11.5px] lg:text-[13px] font-extrabold tracking-[0.16em] text-primary">
                        {COMPANY.name}
                    </div>
                    <h1
                        data-reveal="1"
                        style={{ transitionDelay: '0.08s' }}
                        className="mt-3.5 lg:mt-6 text-[34px] lg:text-[60px] leading-[1.22] lg:leading-[1.18] font-extrabold tracking-tight lg:tracking-[-0.04em] max-w-[20ch] [text-wrap:balance]"
                    >
                        Таны итгэлтэй автомашины сонголт
                    </h1>
                    <div data-reveal="1" style={{ transitionDelay: '0.16s' }} className="flex gap-2 lg:gap-2.5 mt-6 lg:mt-9">
                        <Link
                            to="/search"
                            className="h-12 lg:h-[52px] px-[22px] lg:px-7 flex-none border-0 rounded-3xl lg:rounded-[26px] bg-primary text-white text-sm lg:text-[15px] font-bold flex items-center whitespace-nowrap hover:bg-primary-dark transition-colors"
                        >
                            Автомашин үзэх
                        </Link>
                        <a
                            href="tel:01077550118"
                            className="flex items-center h-12 lg:h-[52px] px-[22px] lg:px-7 border border-line-2 rounded-3xl lg:rounded-[26px] text-ink text-sm lg:text-[15px] font-bold whitespace-nowrap"
                        >
                            Холбоо барих
                        </a>
                    </div>
                </section>

                {/* 소개 문단 */}
                <section className="max-w-[1180px] mx-auto px-4 lg:px-6 pt-12 lg:pt-24">
                    <p
                        data-reveal="1"
                        className="m-0 text-xl lg:text-[30px] leading-[1.6] font-bold tracking-tight lg:tracking-[-0.03em] text-muted-3 max-w-[44ch] [text-wrap:pretty]"
                    >
                        DT TRADING нь хэрэглэгч бүрийн хэрэгцээ, төсөвт тохирсон чанартай хуучин автомашиныг санал болгодог
                        автомашины худалдааны компани юм. Бид автомашин бүрийн мэдээллийг ойлгомжтой, ил тод хүргэж,
                        сонголтоос эхлээд худалдан авалт хүртэлх үйл явцад найдвартай зөвлөгөө, шуурхай үйлчилгээг
                        үзүүлэхийг эрхэмлэдэг.
                    </p>
                </section>

                {/* 이미지 마퀴 */}
                <section className="pt-10 lg:pt-[72px] overflow-hidden">
                    <div className="flex gap-3 lg:gap-5 items-center w-max animate-marquee">
                        {[...STRIP, ...STRIP].map((p, i) => (
                            <div
                                key={i}
                                className="flex-none rounded-[14px] lg:rounded-[18px] bg-surface-2 flex items-end p-3 lg:p-4 overflow-hidden relative w-[var(--w)] h-[var(--h)] lg:w-[var(--lgw)] lg:h-[var(--lgh)]"
                                style={{
                                    '--w': `${p.w}px`,
                                    '--h': `${p.h}px`,
                                    '--lgw': `${p.lgW}px`,
                                    '--lgh': `${p.lgH}px`,
                                } as React.CSSProperties}
                            >
                                {p.image ? (
                                    <img src={p.image} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                                ) : (
                                    <span className="text-[10px] lg:text-[11px] font-bold tracking-[0.14em] text-muted-3">{p.label}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* 미션 / 비전 */}
                <section className="max-w-[1180px] mx-auto px-4 lg:px-6 pt-12 lg:pt-[100px]">
                    <div data-reveal="1" className="flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:gap-16">
                        <div>
                            <div className="text-[12.5px] lg:text-[13px] font-extrabold">Бидний эрхэм зорилго</div>
                            <p className="mt-3 lg:mt-[18px] m-0 text-lg lg:text-2xl leading-[1.55] font-bold tracking-tight [text-wrap:pretty]">
                                Хэрэглэгчдэд найдвартай мэдээлэл, зөв сонголт, хариуцлагатай үйлчилгээг хүргэж, автомашин
                                худалдан авах үйл явцыг илүү хялбар, ойлгомжтой болгоно.
                            </p>
                        </div>
                        <div>
                            <div className="text-[12.5px] lg:text-[13px] font-extrabold">Бидний алсын хараа</div>
                            <p className="mt-3 lg:mt-[18px] m-0 text-lg lg:text-2xl leading-[1.55] font-bold tracking-tight [text-wrap:pretty]">
                                Монголын хуучин автомашины худалдааны салбарт итгэлцэл, ил тод байдал, чанартай үйлчилгээний
                                шинэ стандартыг бий болгоно.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 서비스 */}
                <section className="max-w-[1180px] mx-auto px-4 lg:px-6 pt-12 lg:pt-[100px]">
                    <div data-reveal="1" className="lg:grid lg:grid-cols-[380px_1fr] lg:gap-14 lg:items-start">
                        <div>
                            <div className="text-[12.5px] lg:text-[13px] font-extrabold">Бидний үйлчилгээ</div>
                            <h2 className="mt-3 lg:mt-3.5 mb-1 lg:mb-0 text-[26px] lg:text-[40px] leading-[1.3] lg:leading-[1.25] font-extrabold tracking-tight lg:tracking-[-0.035em] [text-wrap:balance]">
                                Сонголтоос захиалга хүртэл нэг дор
                            </h2>
                            <p className="hidden lg:block mt-[22px] m-0 text-[15px] leading-[1.8] text-muted [text-wrap:pretty]">
                                Таны цаг хугацаа, итгэл, сэтгэл ханамж бол бидний хамгийн үнэт зүйл.
                            </p>
                        </div>
                        <div className="mt-[18px] lg:mt-0 flex flex-col">
                            {SERVICES.map((label, i) => (
                                <div
                                    key={label}
                                    className="flex items-baseline gap-3.5 lg:gap-[22px] py-[18px] lg:py-[26px] px-0.5 lg:px-1 border-t border-line"
                                >
                                    <span className="text-xs lg:text-[13px] font-extrabold text-primary flex-none w-5 lg:w-[26px]">0{i + 1}</span>
                                    <span className="text-base lg:text-[21px] font-bold tracking-tight lg:tracking-[-0.025em] leading-[1.45] [text-wrap:pretty]">
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 이유 */}
                <section className="max-w-[1180px] mx-auto px-4 lg:px-6 pt-12 lg:pt-[100px]">
                    <div className="text-[12.5px] lg:text-[13px] font-extrabold">Яагаад {COMPANY.name} гэж?</div>
                    <h2
                        data-reveal="1"
                        style={{ transitionDelay: '0.05s' }}
                        className="mt-3 lg:mt-3.5 mb-6 lg:mb-11 text-[26px] lg:text-[40px] leading-[1.3] lg:leading-[1.25] font-extrabold tracking-tight lg:tracking-[-0.035em]"
                    >
                        Итгэлцлээс эхэлдэг худалдаа
                    </h2>
                    <div className="flex flex-col gap-7 lg:grid lg:grid-cols-2 lg:gap-y-7 lg:gap-x-14">
                        {REASONS.map(r => (
                            <div key={r.title} data-reveal="1">
                                <div className="aspect-[16/10] rounded-2xl lg:rounded-[18px] bg-surface-2 flex items-end p-3.5 lg:p-[18px] overflow-hidden relative">
                                    {r.image ? (
                                        <img src={r.image} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                                    ) : (
                                        <span className="text-[10px] lg:text-[11px] font-bold tracking-[0.14em] text-muted-3">ЗУРАГ</span>
                                    )}
                                </div>
                                <div className="mt-4 lg:mt-6 text-[19px] lg:text-2xl font-extrabold tracking-tight lg:tracking-[-0.03em]">
                                    {r.title}
                                </div>
                                <p className="mt-2.5 lg:mt-3 m-0 text-[14.5px] lg:text-[15.5px] leading-[1.75] text-muted [text-wrap:pretty]">
                                    {r.body}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 통계 */}
                <section className="pt-12 lg:pt-[100px] overflow-hidden">
                    <div className="max-w-[1180px] mx-auto px-4 lg:px-6">
                        <h2
                            data-reveal="1"
                            className="m-0 text-[26px] lg:text-[40px] leading-[1.3] lg:leading-[1.28] font-extrabold tracking-tight lg:tracking-[-0.035em] max-w-[18ch]"
                        >
                            Бид тоогоор ч ил тод
                        </h2>
                        <div className="mt-2.5 lg:mt-3.5 text-[12.5px] lg:text-[13.5px] font-semibold text-muted-3">
                            2026 оны 8 сарын байдлаар
                        </div>
                    </div>
                    <div className="mt-[22px] lg:mt-11 flex gap-3 lg:gap-5 px-4 lg:px-6 overflow-x-auto no-scrollbar max-w-[1180px] mx-auto">
                        {STATS.map((s, i) => (
                            <div
                                key={s.label}
                                data-reveal="1"
                                className="flex-none w-[210px] h-[210px] lg:w-[270px] lg:h-[270px] rounded-[20px] p-[22px] lg:p-7 flex flex-col"
                                style={{ background: s.tint, transitionDelay: `${i * 0.08}s` }}
                            >
                                <div className="text-[13px] lg:text-sm font-extrabold">{s.label}</div>
                                <div className="mt-auto text-[34px] lg:text-[46px] font-extrabold tracking-tight lg:tracking-[-0.04em]">
                                    {s.value}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
            <BottomNav />
        </div>
    );
}
