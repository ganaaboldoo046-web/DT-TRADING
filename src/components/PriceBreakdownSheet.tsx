import { useEffect, useState } from 'react';
import { Copy, X } from 'lucide-react';
import { computeBreakdown, fetchPricingData, fmtKRW, fmtMNT } from '../utils/pricing';
import type { PriceBreakdown } from '../utils/pricing';
import type { Product } from '../utils/storage';

interface Props {
    product: Product;
    open: boolean;
    onClose: () => void;
}

/**
 * Үнийн задаргаа — 가격 상세 내역 시트.
 * 모든 항목은 KRW 가격 + 환율 + 공통 설정 + 공식 특소세 표로 자동 계산된다.
 */
export default function PriceBreakdownSheet({ product, open, onClose }: Props) {
    const [breakdown, setBreakdown] = useState<PriceBreakdown | null>(null);
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    useEffect(() => {
        if (!open) return;
        setStatus('loading');
        fetchPricingData().then(data => {
            if (!data) { setStatus('error'); return; }
            const bd = computeBreakdown(product, data.rate, data.settings);
            if (!bd) { setStatus('error'); return; }
            setBreakdown(bd);
            setStatus('ready');
        });
    }, [open, product]);

    if (!open) return null;

    const copyVin = () => {
        if (!product.vin) return;
        navigator.clipboard.writeText(product.vin).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        }).catch(() => { /* ignore */ });
    };

    const row = (label: string, value: string, opts?: { strong?: boolean }) => (
        <div className="flex items-baseline justify-between gap-4 py-[11px] border-b border-surface-2 last:border-0">
            <span className={`text-[13px] ${opts?.strong ? 'font-extrabold text-ink' : 'font-medium text-muted'}`}>{label}</span>
            <span className={`${opts?.strong ? 'text-[17px] font-extrabold' : 'text-[13.5px] font-bold'} tracking-tight whitespace-nowrap`}>{value}</span>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[60] bg-black/70 flex items-end lg:items-center justify-center lg:p-6" onClick={onClose}>
            <div
                className="w-[430px] max-w-full max-h-[88vh] overflow-y-auto bg-surface rounded-t-[20px] lg:rounded-[20px] animate-sheet-up lg:animate-none"
                onClick={e => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-surface px-5 pt-[18px] pb-3 flex items-start justify-between gap-3.5 border-b border-surface-2">
                    <div>
                        <div className="text-lg font-extrabold tracking-tight">Үнийн задаргаа</div>
                        <div className="mt-0.5 text-[12px] text-muted">Машины бүрэн үнийн мэдээлэл</div>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Хаах"
                        className="w-[34px] h-[34px] flex-none border-0 rounded-[10px] bg-line text-muted flex items-center justify-center"
                    >
                        <X size={16} />
                    </button>
                </div>

                {status === 'loading' && (
                    <div className="py-16 flex justify-center">
                        <div className="w-8 h-8 border-4 border-line border-t-primary rounded-full animate-spin" />
                    </div>
                )}

                {status === 'error' && (
                    <div className="px-5 py-12 text-center text-[13px] text-muted">
                        Мэдээлэл ачаалахад алдаа гарлаа. Дахин оролдоно уу.
                    </div>
                )}

                {status === 'ready' && breakdown && (
                    <div className="px-5 pt-1 pb-6">
                        {product.vin && (
                            <div className="flex items-center justify-between gap-4 py-[11px] border-b border-surface-2">
                                <span className="text-[13px] font-medium text-muted">VIN:</span>
                                <button onClick={copyVin} className="flex items-center gap-1.5 text-[12.5px] font-bold tracking-tight text-ink">
                                    {product.vin}
                                    <Copy size={12} className={copied ? 'text-primary' : 'text-muted-2'} />
                                </button>
                            </div>
                        )}
                        {row('Үндсэн үнэ:', fmtKRW(breakdown.baseKRW))}
                        {row('Үндсэн үнэ (MNT):', fmtMNT(breakdown.baseMNT))}
                        {row('Монгол үйлчилгээний шимтгэл:', fmtMNT(breakdown.serviceFee))}
                        {row('Тээврийн зардал:', fmtMNT(breakdown.transport))}
                        {row('Онцгой албан татвар:', breakdown.exciseKnown ? fmtMNT(breakdown.excise) : 'Тодруулна')}
                        {row('Гаалийн татвар/НӨАТ:', fmtMNT(breakdown.customsVat))}

                        <div className="mt-2 pt-1">
                            {row('Нийт дүн:', fmtMNT(breakdown.total), { strong: true })}
                        </div>

                        <div className="mt-3 bg-surface-2 border border-line rounded-xl px-4 py-1">
                            {row('Урьдчилгаанд төлөх төлбөр:', fmtMNT(breakdown.prepay))}
                            {row('Монголд ирсэн үед төлөх нийт төлбөр:', fmtMNT(breakdown.onArrival))}
                        </div>

                        <p className="mt-3.5 mb-0 text-[11px] leading-[1.6] text-muted-2">
                            Тооцоолол нь өнөөдрийн ханш болон албан ёсны татварын хувь хэмжээнд суурилсан бөгөөд
                            ханшийн өөрчлөлтөөс шалтгаалж бага зэрэг хэлбэлзэж болно.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
