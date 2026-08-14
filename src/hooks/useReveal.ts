import { useEffect } from 'react';

/**
 * [data-reveal] 요소를 스크롤 진입 시 표시 (About 페이지 애니메이션).
 * 0.9초 안에 감지되지 않은 뷰포트 내 요소는 강제 표시하여 빈 화면 방지.
 */
export function useReveal(deps: unknown[] = []) {
    useEffect(() => {
        const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-shown])'));
        if (els.length === 0) return;

        if (typeof IntersectionObserver === 'undefined') {
            els.forEach(el => el.setAttribute('data-shown', '1'));
            return;
        }

        const io = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.setAttribute('data-shown', '1');
                    io.unobserve(e.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

        els.forEach(el => io.observe(el));

        // 안전장치: 뷰포트 안에 있는데 아직 안 보이면 강제 표시
        const fallback = setTimeout(() => {
            document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-shown])').forEach(el => {
                const r = el.getBoundingClientRect();
                if (r.top < (window.innerHeight || 800) * 1.1) el.setAttribute('data-shown', '1');
            });
        }, 900);

        return () => {
            io.disconnect();
            clearTimeout(fallback);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}
