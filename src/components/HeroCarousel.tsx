import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Image from './Image';
import type { Banner } from '../utils/storage';

interface Slide {
    badge: string;
    title: string;
    body: string;
    cta: string;
    bg: string;
    image?: string;
}

const SLIDES: Slide[] = [
    {
        badge: 'DT TRADING',
        title: 'Солонгосоос шууд, шалгагдсан автомашин',
        body: 'Бүх машин 200 цэгийн үзлэг, ослын түүхийн баталгаатай. Импортын бүх ажиллагааг бид хариуцна.',
        cta: 'Машин үзэх',
        bg: 'linear-gradient(120deg, #0D0D0D 0%, #2A0A0A 55%, #B70000 100%)',
    },
    {
        badge: 'ГААЛЬ · ТЭЭВЭР',
        title: 'Монголд очих үнэ нь эцсийн үнэ',
        body: 'Тээвэр, гааль, улсын бүртгэл бүгд багцад. Нэмэлт төлбөргүй, нуугдмал зардалгүй.',
        cta: 'Үнэ харах',
        bg: 'linear-gradient(120deg, #0D0D0D 0%, #1A1A1A 50%, #7A0000 100%)',
    },
    {
        badge: 'DT CARE',
        title: '1 жилийн баталгаа, бэлэн зар',
        body: 'Худалдан авсны дараа ч засвар үйлчилгээний дэмжлэг үргэлжилнэ.',
        cta: 'Баталгаат зар',
        bg: 'linear-gradient(120deg, #000000 0%, #2C2C2C 55%, #B70000 100%)',
    },
];

/**
 * PC 디자인의 홈 히어로 캐러셀. 5초 자동 전환, 마우스 올리면 정지.
 * 관리자에서 등록한 활성 배너가 있으면 그걸 쓰고, 없으면 기본 슬라이드를 보여준다.
 */
export default function HeroCarousel({ banners = [] }: { banners?: Banner[] }) {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    const slides: Slide[] = banners.length > 0
        ? banners.map((b, i) => ({
            badge: 'DT TRADING',
            title: b.title,
            body: b.subtitle || '',
            cta: 'Машин үзэх',
            bg: SLIDES[i % SLIDES.length].bg,
            image: b.image || undefined,
        }))
        : SLIDES;

    useEffect(() => {
        if (paused || slides.length < 2) return;
        const timer = setInterval(() => setIndex(i => (i + 1) % slides.length), 5000);
        return () => clearInterval(timer);
    }, [paused, slides.length]);

    // 배너 수가 줄었을 때 인덱스가 범위를 벗어나지 않게
    useEffect(() => {
        if (index >= slides.length) setIndex(0);
    }, [slides.length, index]);

    const go = (dir: number) => setIndex(i => (i + dir + slides.length) % slides.length);

    return (
        <section className="mb-10">
            <div
                className="relative h-[360px] overflow-hidden"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                {slides.map((slide, i) => {
                    let off = i - index;
                    if (off > 1) off -= slides.length;
                    if (off < -1) off += slides.length;
                    const active = slides.length === 1 ? i === index : off === 0;
                    return (
                        <div
                            key={`${slide.title}-${i}`}
                            aria-hidden={!active}
                            className="absolute top-0 bottom-0 w-[82%] rounded-[20px] overflow-hidden transition-all duration-500 ease-out"
                            style={{
                                left: active ? '9%' : off < 0 ? '-71%' : '89%',
                                background: slide.bg,
                                opacity: active ? 1 : 0.35,
                                transform: active ? 'scale(1)' : 'scale(0.94)',
                                pointerEvents: active ? 'auto' : 'none',
                            }}
                        >
                            {slide.image && (
                                <>
                                    <div className="absolute inset-0">
                                        <Image src={slide.image} alt="" className="w-full h-full object-cover" size="full" priority={i === 0} />
                                    </div>
                                    {/* 텍스트 가독성용 어두운 그라데이션 */}
                                    <div
                                        className="absolute inset-0"
                                        style={{ background: 'linear-gradient(100deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.15) 100%)' }}
                                    />
                                </>
                            )}
                            <div className="relative h-full px-14 flex flex-col justify-center">
                                <div className="text-[13px] font-extrabold tracking-[0.16em] text-white/70">{slide.badge}</div>
                                <h1 className="mt-5 mb-3 text-[40px] leading-[1.18] font-extrabold tracking-tight text-white max-w-[15ch] [text-wrap:balance] whitespace-pre-line">
                                    {slide.title}
                                </h1>
                                {slide.body && (
                                    <p className="m-0 mb-[26px] text-[15px] leading-[1.6] text-white/[.72] max-w-[46ch]">{slide.body}</p>
                                )}
                                <div>
                                    <Link
                                        to="/search"
                                        className="inline-flex items-center h-12 px-6 rounded-xl bg-white text-[15px] font-bold text-slate-900 hover:bg-white/90 transition-colors"
                                    >
                                        {slide.cta}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {slides.length > 1 && (
                <div className="flex items-center justify-center gap-[18px] mt-[18px]">
                    <button
                        onClick={() => go(-1)}
                        aria-label="Өмнөх"
                        className="w-[38px] h-[38px] border border-line rounded-full bg-surface text-ink-3 text-sm"
                    >
                        ‹
                    </button>
                    <div className="flex items-center gap-2">
                        {slides.map((s, i) => (
                            <button
                                key={`${s.title}-${i}`}
                                onClick={() => setIndex(i)}
                                aria-label={`${i + 1}-р слайд`}
                                className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-primary' : 'w-2 bg-line-2'}`}
                            />
                        ))}
                    </div>
                    <button
                        onClick={() => go(1)}
                        aria-label="Дараах"
                        className="w-[38px] h-[38px] border border-line rounded-full bg-surface text-ink-3 text-sm"
                    >
                        ›
                    </button>
                </div>
            )}
        </section>
    );
}
