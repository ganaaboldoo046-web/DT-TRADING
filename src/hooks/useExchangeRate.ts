import { useEffect, useState } from 'react';

/**
 * 1 KRW = n MNT 환율. 관리자 페이지에서 설정한 값을 D1에서 읽어온다.
 * 데스크탑 헤더의 환율 뱃지에 사용.
 */
export function useExchangeRate() {
    const [rate, setRate] = useState<number | null>(null);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const res = await fetch('/api/exchange_rate');
                if (!res.ok) return;
                const data = await res.json() as { rate?: number };
                if (!cancelled && typeof data.rate === 'number') setRate(data.rate);
            } catch {
                /* 환율을 못 읽어도 화면은 정상 동작해야 하므로 무시 */
            }
        };
        load();
        window.addEventListener('exchangeRateUpdated', load);
        return () => {
            cancelled = true;
            window.removeEventListener('exchangeRateUpdated', load);
        };
    }, []);

    return rate;
}
