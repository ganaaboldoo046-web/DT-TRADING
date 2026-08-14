import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const SLIDES = [
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

/** PC 디자인의 홈 히어로 캐러셀. 5초 자동 전환, 마우스 올리면 정지. */
export default function HeroCarousel() {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused) return;
        const timer = setInterval(() => setIndex(i => (i + 1) % SLIDES.length), 5000);
        return () => clearInterval(timer);
    }, [paused]);

    const go = (dir: number) => setIndex(i => (i + dir + SLIDES.length) % SLIDES.length);

    return (
        <section className="mb-10">
            <div
                className="relative h-[360px] overflow-hidden"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                {SLIDES.map((slide, i) => {
                    let off = i - index;
                    if (off > 1) off -= SLIDES.length;
                    if (off < -1) off += SLIDES.length;
                    const active = off === 0;
                    return (
                        <div
                            key={slide.title}
                            aria-hidden={!active}
                            className="absolute top-0 bottom-0 w-[82%] rounded-[20px] overflow-hidden px-14 flex flex-col justify-center transition-all duration-500 ease-out"
                            style={{
                                left: active ? '9%' : off < 0 ? '-71%' : '89%',
                                background: slide.bg,
                                opacity: active ? 1 : 0.35,
                                transform: active ? 'scale(1)' : 'scale(0.94)',
                                pointerEvents: active ? 'auto' : 'none',
                            }}
                        >
                            <div className="text-[13px] font-extrabold tracking-[0.16em] text-white/70">{slide.badge}</div>
                            <h1 className="mt-5 mb-3 text-[40px] leading-[1.18] font-extrabold tracking-tight text-white max-w-[15ch] [text-wrap:balance]">
                                {slide.title}
                            </h1>
                            <p className="m-0 mb-[26px] text-[15px] leading-[1.6] text-white/[.72] max-w-[46ch]">{slide.body}</p>
                            <div>
                                <Link
                                    to="/search"
                                    className="inline-flex items-center h-12 px-6 rounded-xl bg-white text-[15px] font-bold text-slate-900 hover:bg-white/90 transition-colors"
                                >
                                    {slide.cta}
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center justify-center gap-[18px] mt-[18px]">
                <button
                    onClick={() => go(-1)}
                    aria-label="Өмнөх"
                    className="w-[38px] h-[38px] border border-line rounded-full bg-surface text-ink-3 text-sm"
                >
                    ‹
                </button>
                <div className="flex items-center gap-2">
                    {SLIDES.map((s, i) => (
                        <button
                            key={s.title}
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
        </section>
    );
}
