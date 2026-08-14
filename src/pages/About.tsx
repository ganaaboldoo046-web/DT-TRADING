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
    { label: 'ЗУРАГ 01', h: 180, w: 140, image: '/about.jpg' },
    { label: 'ЗУРАГ 02', h: 230, w: 175, image: '/629659718_930285069576307_7594762200449531737_n.jpg' },
    { label: 'ЗУРАГ 03', h: 195, w: 205 },
    { label: 'ЗУРАГ 04', h: 245, w: 170 },
    { label: 'ЗУРАГ 05', h: 170, w: 215 },
    { label: 'ЗУРАГ 06', h: 210, w: 160 },
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
            <main className="pb-8">
                {/* 히어로 */}
                <section className="px-4 pt-10">
                    <div data-reveal="1" className="text-[11.5px] font-extrabold tracking-[0.16em] text-primary">
                        {COMPANY.name}
                    </div>
                    <h1
                        data-reveal="1"
                        style={{ transitionDelay: '0.08s' }}
                        className="mt-3.5 text-[34px] leading-[1.22] font-extrabold tracking-tight [text-wrap:balance]"
                    >
                        Таны итгэлтэй автомашины сонголт
                    </h1>
                    <div data-reveal="1" style={{ transitionDelay: '0.16s' }} className="flex gap-2 mt-6">
                        <Link
                            to="/search"
                            className="h-12 px-[22px] flex-none border-0 rounded-3xl bg-primary text-white text-sm font-bold flex items-center active:scale-95 transition-transform"
                        >
                            Автомашин үзэх
                        </Link>
                        <a
                            href="tel:01077550118"
                            className="flex items-center h-12 px-[22px] border border-line-2 rounded-3xl text-ink text-sm font-bold"
                        >
                            Холбоо барих
                        </a>
                    </div>
                </section>

                {/* 소개 문단 */}
                <section className="px-4 pt-12">
                    <p data-reveal="1" className="m-0 text-xl leading-[1.6] font-bold tracking-tight text-muted-3 [text-wrap:pretty]">
                        DT TRADING нь хэрэглэгч бүрийн хэрэгцээ, төсөвт тохирсон чанартай хуучин автомашиныг санал болгодог
                        автомашины худалдааны компани юм. Бид автомашин бүрийн мэдээллийг ойлгомжтой, ил тод хүргэж,
                        сонголтоос эхлээд худалдан авалт хүртэлх үйл явцад найдвартай зөвлөгөө, шуурхай үйлчилгээг
                        үзүүлэхийг эрхэмлэдэг.
                    </p>
                </section>

                {/* 이미지 마퀴 */}
                <section className="pt-10 overflow-hidden">
                    <div className="flex gap-3 items-center w-max animate-marquee">
                        {[...STRIP, ...STRIP].map((p, i) => (
                            <div
                                key={i}
                                className="flex-none rounded-[14px] bg-surface-2 flex items-end p-3 overflow-hidden relative"
                                style={{ width: p.w, height: p.h }}
                            >
                                {p.image && (
                                    <img src={p.image} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                                )}
                                {!p.image && (
                                    <span className="text-[10px] font-bold tracking-[0.14em] text-muted-3">{p.label}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* 미션 / 비전 */}
                <section className="px-4 pt-12 flex flex-col gap-8">
                    <div data-reveal="1">
                        <div className="text-[12.5px] font-extrabold">Бидний эрхэм зорилго</div>
                        <p className="mt-3 m-0 text-lg leading-[1.55] font-bold tracking-tight [text-wrap:pretty]">
                            Хэрэглэгчдэд найдвартай мэдээлэл, зөв сонголт, хариуцлагатай үйлчилгээг хүргэж, автомашин
                            худалдан авах үйл явцыг илүү хялбар, ойлгомжтой болгоно.
                        </p>
                    </div>
                    <div data-reveal="1" style={{ transitionDelay: '0.08s' }}>
                        <div className="text-[12.5px] font-extrabold">Бидний алсын хараа</div>
                        <p className="mt-3 m-0 text-lg leading-[1.55] font-bold tracking-tight [text-wrap:pretty]">
                            Монголын хуучин автомашины худалдааны салбарт итгэлцэл, ил тод байдал, чанартай үйлчилгээний
                            шинэ стандартыг бий болгоно.
                        </p>
                    </div>
                </section>

                {/* 서비스 */}
                <section className="px-4 pt-12">
                    <div data-reveal="1" className="text-[12.5px] font-extrabold">Бидний үйлчилгээ</div>
                    <h2
                        data-reveal="1"
                        style={{ transitionDelay: '0.06s' }}
                        className="mt-3 mb-1 text-[26px] leading-[1.3] font-extrabold tracking-tight [text-wrap:balance]"
                    >
                        Сонголтоос захиалга хүртэл нэг дор
                    </h2>
                    <div className="mt-[18px] flex flex-col">
                        {SERVICES.map((label, i) => (
                            <div key={label} data-reveal="1" className="flex items-baseline gap-3.5 py-[18px] px-0.5 border-t border-line">
                                <span className="text-xs font-extrabold text-primary flex-none w-5">0{i + 1}</span>
                                <span className="text-base font-bold tracking-tight leading-[1.45] [text-wrap:pretty]">{label}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 이유 */}
                <section className="px-4 pt-12">
                    <div data-reveal="1" className="text-[12.5px] font-extrabold">Яагаад {COMPANY.name} гэж?</div>
                    <h2
                        data-reveal="1"
                        style={{ transitionDelay: '0.06s' }}
                        className="mt-3 mb-6 text-[26px] leading-[1.3] font-extrabold tracking-tight"
                    >
                        Итгэлцлээс эхэлдэг худалдаа
                    </h2>
                    <div className="flex flex-col gap-7">
                        {REASONS.map(r => (
                            <div key={r.title} data-reveal="1">
                                <div className="aspect-[16/10] rounded-2xl bg-surface-2 flex items-end p-3.5 overflow-hidden relative">
                                    {r.image && (
                                        <img src={r.image} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                                    )}
                                    {!r.image && (
                                        <span className="text-[10px] font-bold tracking-[0.14em] text-muted-3">ЗУРАГ</span>
                                    )}
                                </div>
                                <div className="mt-4 text-[19px] font-extrabold tracking-tight">{r.title}</div>
                                <p className="mt-2.5 m-0 text-[14.5px] leading-[1.75] text-muted [text-wrap:pretty]">{r.body}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 통계 */}
                <section className="pt-12 overflow-hidden">
                    <div className="px-4">
                        <h2 data-reveal="1" className="m-0 text-[26px] leading-[1.3] font-extrabold tracking-tight">
                            Бид тоогоор ч ил тод
                        </h2>
                        <div className="mt-2.5 text-[12.5px] font-semibold text-muted-3">2026 оны 8 сарын байдлаар</div>
                    </div>
                    <div className="mt-[22px] flex gap-3 px-4 overflow-x-auto no-scrollbar">
                        {STATS.map((s, i) => (
                            <div
                                key={s.label}
                                data-reveal="1"
                                className="flex-none w-[210px] h-[210px] rounded-[20px] p-[22px] flex flex-col"
                                style={{ background: s.tint, transitionDelay: `${i * 0.08}s` }}
                            >
                                <div className="text-[13px] font-extrabold">{s.label}</div>
                                <div className="mt-auto text-[34px] font-extrabold tracking-tight">{s.value}</div>
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
