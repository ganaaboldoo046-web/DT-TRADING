import { useEffect, useRef, useState } from 'react';
import Image from './Image';
import type { Banner } from '../utils/storage';

const HERO_GRADIENT = 'linear-gradient(130deg, #0D0D0D 0%, #2A0A0A 55%, #B70000 100%)';
const AUTO_MS = 4000;

/**
 * 모바일 홈 배너 슬라이더.
 * 관리자에서 등록한 활성 배너를 전부 보여주고 4초마다 자동 전환.
 * 스크롤 스냅 기반이라 손가락 스와이프도 자연스럽게 동작한다.
 */
export default function MobileBannerSlider({ banners }: { banners: Banner[] }) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [index, setIndex] = useState(0);
    const pausedRef = useRef(false);
    const count = banners.length;

    useEffect(() => {
        if (count < 2) return;
        const timer = setInterval(() => {
            const el = trackRef.current;
            if (!el || pausedRef.current) return;
            const current = Math.round(el.scrollLeft / el.clientWidth);
            const next = (current + 1) % count;
            el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' });
        }, AUTO_MS);
        return () => clearInterval(timer);
    }, [count]);

    const onScroll = () => {
        const el = trackRef.current;
        if (!el) return;
        setIndex(Math.min(count - 1, Math.max(0, Math.round(el.scrollLeft / el.clientWidth))));
    };

    return (
        <div className="relative">
            <div
                ref={trackRef}
                onScroll={onScroll}
                onTouchStart={() => { pausedRef.current = true; }}
                onTouchEnd={() => { pausedRef.current = false; }}
                className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar rounded-[18px]"
            >
                {banners.map((b, i) => (
                    <div
                        key={b.id}
                        className="relative w-full flex-shrink-0 snap-center overflow-hidden px-[22px] pt-6 pb-[30px] min-h-[132px]"
                        style={{ background: HERO_GRADIENT }}
                    >
                        {b.image && (
                            <div className="absolute inset-0 opacity-40">
                                <Image src={b.image} alt="" className="w-full h-full object-cover" size="medium" priority={i === 0} />
                            </div>
                        )}
                        <div className="relative">
                            <div className="mt-2.5 text-[22px] font-extrabold leading-[1.3] text-white tracking-tight whitespace-pre-line">
                                {b.title}
                            </div>
                            {b.subtitle && (
                                <div className="mt-2 text-[12.5px] text-white/[.72] leading-[1.55]">{b.subtitle}</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* 인디케이터 점 */}
            {count > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {banners.map((b, i) => (
                        <button
                            key={b.id}
                            onClick={() => trackRef.current?.scrollTo({ left: i * (trackRef.current?.clientWidth || 0), behavior: 'smooth' })}
                            aria-label={`${i + 1}-р баннер`}
                            className={`h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/40'}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
