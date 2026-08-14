// Үнийн задаргаа(가격 상세 내역) 계산.
// 특별소비세는 몽골 공식 세율표(배기량 × 연식 × 연료)를 그대로 사용한다.
import type { Product } from './storage';

export interface PricingSettings {
    serviceFee: number;
    transport: number;
    customsPct: number;
    vatPct: number;
}

export interface PriceBreakdown {
    baseKRW: number;
    baseMNT: number;
    serviceFee: number;
    transport: number;
    excise: number;
    customsVat: number;
    total: number;
    prepay: number;      // Урьдчилгаанд төлөх (차값 + 수수료)
    onArrival: number;   // Монголд ирсэн үед төлөх (운송 + 세금)
    exciseKnown: boolean; // 배기량/연식을 읽지 못하면 false
}

// 공식 세율표 3.3 — 가솔린/디젤 (배기량cc 구간 × 연식 구간, ₮)
const EXCISE_FUEL: number[][] = [
    //  0–3년,      4–6년,      7–9년,      10년 이상
    [750_000, 1_600_000, 3_350_000, 10_000_000],   // ≤1500cc
    [2_300_000, 3_200_000, 5_000_000, 11_700_000], // 1501–2500
    [3_050_000, 4_000_000, 6_700_000, 13_350_000], // 2501–3500
    [6_850_000, 8_000_000, 10_850_000, 17_500_000], // 3501–4500
    [14_210_000, 27_200_000, 39_150_000, 65_975_000], // 4501+
];

// 공식 세율표 3.4 — 하이브리드/LPG
const EXCISE_HYBRID: number[][] = [
    [375_000, 800_000, 1_675_000, 5_000_000],
    [1_150_000, 1_600_000, 2_500_000, 5_850_000],
    [1_525_000, 2_000_000, 3_350_000, 6_675_000],
    [3_425_000, 4_000_000, 5_425_000, 8_750_000],
    [7_105_000, 13_600_000, 19_575_000, 32_987_500],
];

function ccBand(cc: number): number {
    if (cc <= 1500) return 0;
    if (cc <= 2500) return 1;
    if (cc <= 3500) return 2;
    if (cc <= 4500) return 3;
    return 4;
}

function ageBand(age: number): number {
    if (age <= 3) return 0;
    if (age <= 6) return 1;
    if (age <= 9) return 2;
    return 3;
}

/** "1,998cc" 같은 문자열에서 배기량 숫자를 뽑는다. 못 읽으면 null */
export function parseEngineCc(engine?: string): number | null {
    if (!engine) return null;
    const n = Number(String(engine).replace(/[^0-9]/g, ''));
    return n >= 500 && n <= 10000 ? n : null;
}

/** 특별소비세. 전기차는 면제(0). 배기량/연식을 못 읽으면 null */
export function exciseTax(product: Product): number | null {
    const fuel = (product.fuel || '').toLowerCase();
    if (fuel === 'electric' || fuel.includes('цахилгаан')) return 0;

    const cc = parseEngineCc(product.engine);
    const year = Number(String(product.year).slice(0, 4));
    if (!cc || !year || year < 1980) return null;

    const age = Math.max(0, new Date().getFullYear() - year);
    const hybrid = fuel === 'hybrid' || fuel === 'gas' || fuel.includes('хайбрид') || fuel.includes('газ');
    const table = hybrid ? EXCISE_HYBRID : EXCISE_FUEL;
    return table[ccBand(cc)][ageBand(age)];
}

export function computeBreakdown(
    product: Product,
    krwToMnt: number,
    s: PricingSettings,
): PriceBreakdown | null {
    const baseKRW = product.priceKRW || 0;
    if (!baseKRW || !krwToMnt) return null;

    const baseMNT = Math.round(baseKRW * krwToMnt);
    const exciseRaw = exciseTax(product);
    const excise = exciseRaw ?? 0;

    // 관세 = (차값 + 운송비) × 관세율, 부가세 = (차값 + 운송비 + 관세 + 특소세) × 부가세율
    const customs = Math.round((baseMNT + s.transport) * (s.customsPct / 100));
    const vat = Math.round((baseMNT + s.transport + customs + excise) * (s.vatPct / 100));
    const customsVat = customs + vat;

    const total = baseMNT + s.serviceFee + s.transport + excise + customsVat;
    const prepay = baseMNT + s.serviceFee;

    return {
        baseKRW,
        baseMNT,
        serviceFee: s.serviceFee,
        transport: s.transport,
        excise,
        customsVat,
        total,
        prepay,
        onArrival: total - prepay,
        exciseKnown: exciseRaw !== null,
    };
}

export const fmtMNT = (n: number) => `${n.toLocaleString('en-US').replace(/,/g, "'")}₮`;
export const fmtKRW = (n: number) => `${n.toLocaleString('en-US')}₩`;

/** 환율과 공통 설정을 한 번에 가져온다 */
export async function fetchPricingData(): Promise<{ rate: number; settings: PricingSettings } | null> {
    try {
        const [rateRes, settingsRes] = await Promise.all([
            fetch('/api/exchange_rate'),
            fetch('/api/pricing'),
        ]);
        if (!rateRes.ok || !settingsRes.ok) return null;
        const { rate } = await rateRes.json() as { rate: number };
        const settings = await settingsRes.json() as PricingSettings;
        if (!rate || !Number.isFinite(rate)) return null;
        return { rate, settings };
    } catch {
        return null;
    }
}
