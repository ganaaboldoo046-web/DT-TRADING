import React, { useState, useEffect } from 'react';
import { saveExchangeRate } from '../../utils/storage';

export default function AdminExchangeRate() {
    const [rate, setRate] = useState<number>(0);
    const [lastUpdated, setLastUpdated] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        const fetchRate = async () => {
            try {
                const res = await fetch('/api/exchange_rate');
                if (res.ok) {
                    const data = await res.json();
                    setRate(data.rate);
                    // setLastUpdated(data.updated_at); // Optional if API returns it
                }
            } catch (e) {
                console.error("Failed to fetch rate", e);
            }
        };
        fetchRate();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/exchange_rate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rate })
            });

            if (res.ok) {
                const data = await res.json();
                setMessage({ type: 'success', text: `Ханш амжилттай шинэчлэгдлээ! ${data.updatedProducts} машины үнэ шинэчлэгдсэн.` });
                setLastUpdated(new Date().toISOString());
                // Update local storage for other components if they still use it, or trigger event
                saveExchangeRate({ krwToMnt: rate, lastUpdated: new Date().toISOString() });
            } else {
                throw new Error('Failed to save');
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Хадгалахад алдаа гарлаа.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Ханшны тохиргоо</h1>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <form onSubmit={handleSave}>
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            Солонгос вон (KRW) &rarr; Монгол төгрөг (MNT)
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="flex-1 relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">1 KRW =</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={rate}
                                    onChange={(e) => setRate(parseFloat(e.target.value))}
                                    className="w-full pl-20 pr-12 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg font-bold"
                                    required
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">MNT</span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            Энэ ханшийг өөрчилснөөр бүх машины "Монголд очих үнэ" автоматаар шинэчлэгдэнэ.
                        </p>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-xl mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
                        <div className="text-xs text-slate-400">
                            Сүүлд шинэчилсэн: {new Date(lastUpdated).toLocaleString()}
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isLoading ? 'Хадгалж байна...' : 'Хадгалах'}
                        </button>
                    </div>
                </form>
            </div>

            <PricingSettingsCard />

            {/* Example Calculation Card */}
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-6">
                <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2">Жишээ бодолт:</h3>
                <div className="space-y-2 text-sm text-blue-700 dark:text-blue-200">
                    <div className="flex justify-between">
                        <span>10,000,000 KRW машин</span>
                        <span className="font-bold">&rarr; {(10000000 * rate / 1000000).toFixed(1)} сая ₮</span>
                    </div>
                    <div className="flex justify-between">
                        <span>25,000,000 KRW машин</span>
                        <span className="font-bold">&rarr; {(25000000 * rate / 1000000).toFixed(1)} сая ₮</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Үнийн задаргаа(가격 상세) 공통 설정 — 서비스 수수료·운송비·관세·부가세.
 * 상세 페이지의 가격 내역이 이 값들로 자동 계산된다.
 * 특별소비세는 공식 세율표(배기량×연식)로 자동 계산되므로 여기서 설정하지 않는다.
 */
function PricingSettingsCard() {
    const [form, setForm] = useState({ serviceFee: '', transport: '', customsPct: '', vatPct: '' });
    const [status, setStatus] = useState<'loading' | 'idle' | 'saving' | 'saved' | 'error'>('loading');

    useEffect(() => {
        fetch('/api/pricing')
            .then(res => res.json())
            .then((d: { serviceFee: number; transport: number; customsPct: number; vatPct: number }) => {
                setForm({
                    serviceFee: String(d.serviceFee),
                    transport: String(d.transport),
                    customsPct: String(d.customsPct),
                    vatPct: String(d.vatPct),
                });
                setStatus('idle');
            })
            .catch(() => setStatus('error'));
    }, []);

    const save = async () => {
        setStatus('saving');
        try {
            const res = await fetch('/api/pricing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    serviceFee: Number(form.serviceFee),
                    transport: Number(form.transport),
                    customsPct: Number(form.customsPct),
                    vatPct: Number(form.vatPct),
                }),
            });
            if (!res.ok) throw new Error('save failed');
            setStatus('saved');
            setTimeout(() => setStatus('idle'), 2000);
        } catch {
            setStatus('error');
        }
    };

    const field = (key: keyof typeof form, label: string, suffix: string, step = '1') => (
        <label className="block">
            <span className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{label}</span>
            <div className="relative">
                <input
                    type="number"
                    step={step}
                    value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    disabled={status === 'loading'}
                    className="w-full pr-14 pl-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 font-bold"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">{suffix}</span>
            </div>
        </label>
    );

    return (
        <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Үнийн задаргааны тохиргоо</h3>
            <p className="text-xs text-slate-500 mb-5">
                상세 페이지의 "Үнийн задаргаа"가 이 값으로 자동 계산됩니다.
                특별소비세는 공식 세율표(배기량·연식·연료)로 자동 적용되어 설정할 필요가 없습니다.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {field('serviceFee', 'Монгол үйлчилгээний шимтгэл', '₮')}
                {field('transport', 'Тээврийн зардал', '₮')}
                {field('customsPct', 'Гаалийн татвар', '%', '0.1')}
                {field('vatPct', 'НӨАТ', '%', '0.1')}
            </div>
            <div className="mt-6 flex items-center gap-3">
                <button
                    onClick={save}
                    disabled={status === 'saving' || status === 'loading'}
                    className="bg-primary text-white font-bold px-8 py-3 rounded-xl disabled:opacity-50"
                >
                    {status === 'saving' ? 'Хадгалж байна...' : 'Хадгалах'}
                </button>
                {status === 'saved' && <span className="text-sm font-bold text-green-600">✓ Хадгалагдлаа</span>}
                {status === 'error' && <span className="text-sm font-bold text-red-500">Алдаа гарлаа. Дахин оролдоно уу.</span>}
            </div>
        </div>
    );
}
