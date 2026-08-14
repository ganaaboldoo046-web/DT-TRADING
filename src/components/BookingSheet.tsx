import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { COMPANY } from '../constants/company';
import { getUser } from '../utils/storage';
import type { Product } from '../utils/storage';

interface BookingSheetProps {
    product: Product;
    open: boolean;
    onClose: () => void;
}

/**
 * 주문(Захиалга) 바텀시트 — 디자인 시안의 연락 채널 목록 +
 * 기존 예약 API(/api/reservations_create)와 연동된 요청 폼.
 */
export default function BookingSheet({ product, open, onClose }: BookingSheetProps) {
    const [form, setForm] = useState({ userName: '', phone: '', facebookId: '' });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [error, setError] = useState('');

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    useEffect(() => {
        if (open) {
            const user = getUser();
            setForm(f => ({ ...f, userName: f.userName || user?.name || '' }));
            setStatus('idle');
            setError('');
        }
    }, [open]);

    if (!open) return null;

    const submit = async () => {
        if (!form.userName.trim() || !form.phone.trim()) {
            setError('Нэр болон утасны дугаараа оруулна уу.');
            return;
        }
        setError('');
        setStatus('submitting');
        try {
            const user = getUser();
            const res = await fetch('/api/reservations_create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: product.id,
                    productName: product.name,
                    userId: user?.email,
                    ...form,
                }),
            });
            if (!res.ok) throw new Error('failed');
            setStatus('success');
        } catch {
            setStatus('error');
            setError('Алдаа гарлаа. Дахин оролдоно уу.');
        }
    };

    return (
        <div
            className="fixed inset-0 z-[60] bg-black/70 flex items-end justify-center"
            onClick={onClose}
        >
            <div
                className="w-[430px] max-w-full max-h-[88vh] overflow-y-auto bg-surface rounded-t-[20px] animate-sheet-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="px-5 pt-[18px] flex items-start justify-between gap-3.5">
                    <div className="text-lg font-extrabold tracking-tight">Захиалга өгөх</div>
                    <button
                        onClick={onClose}
                        aria-label="Хаах"
                        className="w-[34px] h-[34px] flex-none border-0 rounded-[10px] bg-transparent text-muted-2 flex items-center justify-center"
                    >
                        <X size={17} />
                    </button>
                </div>

                {status === 'success' ? (
                    <div className="px-5 pt-6 pb-8 text-center">
                        <div className="w-14 h-14 mx-auto rounded-full bg-tint text-primary flex items-center justify-center">
                            <Check size={26} strokeWidth={3} />
                        </div>
                        <div className="mt-4 text-[15px] font-extrabold">Захиалга амжилттай!</div>
                        <div className="mt-1.5 text-[13px] text-muted">Бид тантай удахгүй холбогдох болно.</div>
                        <button
                            onClick={onClose}
                            className="mt-5 w-full h-[52px] border-0 rounded-[13px] bg-primary text-white text-[15px] font-bold active:scale-95 transition-transform"
                        >
                            Хаах
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="px-5 pt-2.5 pb-1 text-[13.5px] leading-[1.65] text-muted">
                            Доорх сувгуудаар бидэнтэй холбогдоно уу. Машины мэдээлэл автоматаар илгээгдэнэ.
                        </div>

                        {/* 연락 채널 */}
                        <div className="px-4 pt-3.5 flex flex-col gap-2.5">
                            {COMPANY.contactChannels.map(c => (
                                <a
                                    key={c.key}
                                    href={c.href}
                                    target={c.href.startsWith('tel:') ? undefined : '_blank'}
                                    rel="noopener"
                                    className="flex items-center gap-3.5 px-4 py-[15px] border border-line rounded-[14px] bg-surface-2 text-ink active:scale-[0.98] transition-transform"
                                >
                                    <span
                                        className="flex-none w-10 h-10 rounded-full text-white flex items-center justify-center text-lg font-extrabold"
                                        style={{ background: c.bg }}
                                    >
                                        {c.icon}
                                    </span>
                                    <span className="flex flex-col gap-[3px] min-w-0">
                                        <span className="text-[15px] font-extrabold tracking-tight">{c.title}</span>
                                        <span className="text-[12.5px] font-medium text-muted">{c.sub}</span>
                                    </span>
                                </a>
                            ))}
                        </div>

                        {/* 예약 요청 폼 (기존 주문 관리 연동) */}
                        <div className="px-4 pt-5 pb-7">
                            <div className="flex items-center gap-3 pb-3.5">
                                <span className="flex-1 h-px bg-line" />
                                <span className="text-[11.5px] font-bold text-muted-2">эсвэл хүсэлт үлдээх</span>
                                <span className="flex-1 h-px bg-line" />
                            </div>
                            <div className="flex flex-col gap-3">
                                <input
                                    value={form.userName}
                                    onChange={e => setForm({ ...form, userName: e.target.value })}
                                    placeholder="Нэр"
                                    className="h-[50px] px-3.5 border border-line rounded-xl bg-surface text-sm font-medium text-ink outline-none focus:border-primary box-border placeholder:text-muted-2"
                                />
                                <input
                                    value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                    type="tel"
                                    placeholder="Утасны дугаар"
                                    className="h-[50px] px-3.5 border border-line rounded-xl bg-surface text-sm font-medium text-ink outline-none focus:border-primary box-border placeholder:text-muted-2"
                                />
                                <input
                                    value={form.facebookId}
                                    onChange={e => setForm({ ...form, facebookId: e.target.value })}
                                    placeholder="Facebook ID (заавал биш)"
                                    className="h-[50px] px-3.5 border border-line rounded-xl bg-surface text-sm font-medium text-ink outline-none focus:border-primary box-border placeholder:text-muted-2"
                                />
                            </div>
                            {error && (
                                <div className="mt-3 text-[12.5px] font-bold text-danger">{error}</div>
                            )}
                            <button
                                onClick={submit}
                                disabled={status === 'submitting'}
                                className="mt-4 w-full h-[52px] border-0 rounded-[13px] bg-primary text-white text-[15px] font-bold active:scale-95 transition-transform disabled:opacity-70 flex items-center justify-center"
                            >
                                {status === 'submitting'
                                    ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    : 'Захиалга илгээх'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
