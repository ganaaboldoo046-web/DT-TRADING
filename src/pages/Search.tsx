import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, X } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { CarListCard } from '../components/CarCard';
import { fuelLabel } from '../constants/company';
import { getProducts, getSavedIds } from '../utils/storage';
import type { Product } from '../utils/storage';

type SortKey = 'recommended' | 'newest' | 'priceAsc' | 'priceDesc' | 'kmAsc';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: 'recommended', label: 'Санал болгох' },
    { key: 'newest', label: 'Шинэ зар эхэлж' },
    { key: 'priceAsc', label: 'Үнэ багаас их рүү' },
    { key: 'priceDesc', label: 'Үнэ ихээс бага руу' },
    { key: 'kmAsc', label: 'Гүйлт багатай нь' },
];

const SORT_LABELS: Record<SortKey, string> = {
    recommended: 'Санал болгох',
    newest: 'Шинэ зар эхэлж',
    priceAsc: 'Үнэ багаас',
    priceDesc: 'Үнэ ихээс',
    kmAsc: 'Гүйлт багатай',
};

interface Filters {
    years: string[];
    prices: string[];
    miles: string[];
    fuels: string[];
}

const EMPTY_FILTERS: Filters = { years: [], prices: [], miles: [], fuels: [] };

const FILTER_GROUPS: { key: keyof Filters; title: string; values: string[] }[] = [
    { key: 'years', title: 'Үйлдвэрлэсэн он', values: ['2020+', '2015–2019', '2014 ба хуучин'] },
    { key: 'miles', title: 'Гүйлт', values: ['50 мянга хүртэл', '50–100 мянга', '100 мянгаас дээш'] },
    { key: 'prices', title: 'Үнэ', values: ['30 сая хүртэл', '30–60 сая', '60 саяас дээш'] },
    { key: 'fuels', title: 'Түлш', values: ['Бензин', 'Дизель', 'Хайбрид', 'Цахилгаан'] },
];

const num = (s: string) => Number(String(s).replace(/[^0-9]/g, '')) || 0;

function parseProduct(p: Product) {
    return {
        year: Number(String(p.year).slice(0, 4)) || 0,
        km: num(p.mileage),
        fuel: fuelLabel(p.fuel),
        price: num(p.price),
    };
}

export default function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    const [products, setProducts] = useState<Product[]>([]);
    const [savedIds, setSavedIds] = useState<number[]>([]);
    const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);
    const [sort, setSort] = useState<SortKey>('recommended');

    useEffect(() => {
        const load = async () => {
            const prods = await getProducts();
            setProducts(prods);
        };
        const syncSaved = () => setSavedIds(getSavedIds());
        load();
        syncSaved();
        window.addEventListener('storageSaved', syncSaved);
        return () => window.removeEventListener('storageSaved', syncSaved);
    }, []);

    useEffect(() => {
        document.body.style.overflow = filtersOpen || sortOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [filtersOpen, sortOpen]);

    const toggleFilter = (key: keyof Filters, value: string) => {
        setFilters(f => ({
            ...f,
            [key]: f[key].includes(value) ? f[key].filter(v => v !== value) : [...f[key], value],
        }));
    };

    const resetFilters = () => setFilters(EMPTY_FILTERS);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const result = products.filter(car => {
            const p = parseProduct(car);
            if (q) {
                const haystack = `${car.name} ${car.year} ${car.fuel} ${fuelLabel(car.fuel)} ${car.description || ''}`.toLowerCase();
                if (!haystack.includes(q)) return false;
            }
            if (filters.fuels.length && !filters.fuels.includes(p.fuel)) return false;
            if (filters.years.length && !filters.years.some(y =>
                (y === '2020+' && p.year >= 2020) ||
                (y === '2015–2019' && p.year >= 2015 && p.year <= 2019) ||
                (y === '2014 ба хуучин' && p.year > 0 && p.year <= 2014))) return false;
            if (filters.prices.length && !filters.prices.some(v =>
                (v === '30 сая хүртэл' && p.price <= 30_000_000) ||
                (v === '30–60 сая' && p.price > 30_000_000 && p.price <= 60_000_000) ||
                (v === '60 саяас дээш' && p.price > 60_000_000))) return false;
            if (filters.miles.length && !filters.miles.some(v =>
                (v === '50 мянга хүртэл' && p.km <= 50_000) ||
                (v === '50–100 мянга' && p.km > 50_000 && p.km <= 100_000) ||
                (v === '100 мянгаас дээш' && p.km > 100_000))) return false;
            return true;
        });

        const sorters: Partial<Record<SortKey, (a: Product, b: Product) => number>> = {
            newest: (a, b) => parseProduct(b).year - parseProduct(a).year,
            priceAsc: (a, b) => parseProduct(a).price - parseProduct(b).price,
            priceDesc: (a, b) => parseProduct(b).price - parseProduct(a).price,
            kmAsc: (a, b) => parseProduct(a).km - parseProduct(b).km,
        };
        const sorter = sorters[sort];
        if (sorter) result.sort(sorter);
        return result;
    }, [products, query, filters, sort]);

    const chips = FILTER_GROUPS.map(g => ({
        key: g.key,
        label: g.title === 'Гүйлт' ? 'Явсан гүйлт' : g.title === 'Түлш' ? 'Шатахуун' : g.title,
        on: filters[g.key].length > 0,
    }));

    return (
        <div className="min-h-screen bg-app text-ink">
            <Header title="Автомашин" hideLogo showBack />
            <main className="pb-24">
                {/* 필터 칩 + 정렬 (스티키) */}
                <div className="sticky top-[61px] z-20 bg-app pt-3 pb-2.5">
                    <div className="flex gap-2 overflow-x-auto px-4 no-scrollbar">
                        {chips.map(c => (
                            <button
                                key={c.key}
                                onClick={() => setFiltersOpen(true)}
                                className={`flex-none h-10 px-[15px] rounded-[20px] border text-[13px] whitespace-nowrap flex items-center gap-2 ${c.on
                                    ? 'border-primary bg-tint text-primary font-bold'
                                    : 'border-line bg-surface-2 text-ink-2 font-semibold'}`}
                            >
                                {c.label}
                                <ChevronDown size={11} className={c.on ? 'text-primary' : 'text-muted-2'} />
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center justify-between gap-2.5 px-4 pt-3">
                        <div className="text-[13.5px] font-bold flex-none">
                            {filtered.length} машин{query ? ` · "${query}"` : ''}
                        </div>
                        <button
                            onClick={() => setSortOpen(true)}
                            className="flex items-center gap-2.5 h-[42px] px-3.5 border border-line rounded-xl bg-surface text-[13px] font-bold text-ink whitespace-nowrap"
                        >
                            {SORT_LABELS[sort]}
                            <ChevronDown size={11} className="text-muted-2" />
                        </button>
                    </div>
                </div>

                {/* 결과 없음 */}
                {filtered.length === 0 && (
                    <div className="mx-4 my-3 bg-surface border border-line rounded-2xl px-5 py-12 text-center">
                        <div className="text-[15px] font-extrabold">Тохирох зар олдсонгүй</div>
                        <div className="mt-1.5 text-[13px] text-muted">Шүүлтүүрээ багасгаад дахин оролдоно уу.</div>
                        <button
                            onClick={resetFilters}
                            className="mt-4 h-11 px-5 border-0 rounded-[11px] bg-primary text-white text-[13.5px] font-bold active:scale-95 transition-transform"
                        >
                            Цэвэрлэх
                        </button>
                    </div>
                )}

                {/* 매물 리스트 */}
                <div className="flex flex-col gap-3 px-4 pt-3">
                    {filtered.map(car => (
                        <CarListCard
                            key={car.id}
                            product={car}
                            saved={savedIds.includes(car.id)}
                            onSavedChange={() => setSavedIds(getSavedIds())}
                        />
                    ))}
                </div>
            </main>

            {/* 정렬 바텀시트 */}
            {sortOpen && (
                <div className="fixed inset-0 z-[55] bg-black/70 flex items-end justify-center" onClick={() => setSortOpen(false)}>
                    <div className="w-[430px] max-w-full bg-surface rounded-t-[20px] animate-sheet-up" onClick={e => e.stopPropagation()}>
                        <div className="px-5 pt-[18px] pb-3 flex items-center justify-between border-b border-surface-2">
                            <div className="text-[17px] font-extrabold tracking-tight">Эрэмбэлэх</div>
                            <button onClick={() => setSortOpen(false)} aria-label="Хаах" className="w-9 h-9 border-0 rounded-[10px] bg-line text-muted flex items-center justify-center">
                                <X size={15} />
                            </button>
                        </div>
                        <div className="px-5 pt-1 pb-[26px] flex flex-col">
                            {SORT_OPTIONS.map(o => (
                                <button
                                    key={o.key}
                                    onClick={() => { setSort(o.key); setSortOpen(false); }}
                                    className={`w-full min-h-[50px] flex items-center justify-between px-1 border-0 border-b border-surface-2 bg-transparent text-[14.5px] ${sort === o.key ? 'font-extrabold text-primary' : 'font-semibold text-ink-2'}`}
                                >
                                    {o.label}
                                    <span>{sort === o.key ? '✓' : ''}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 필터 바텀시트 */}
            {filtersOpen && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-end justify-center" onClick={() => setFiltersOpen(false)}>
                    <div className="w-[430px] max-w-full bg-surface rounded-t-[20px] max-h-[80vh] overflow-y-auto animate-sheet-up" onClick={e => e.stopPropagation()}>
                        <div className="sticky top-0 bg-surface px-5 pt-[18px] pb-3 flex items-center justify-between border-b border-surface-2">
                            <div className="text-[17px] font-extrabold tracking-tight">Шүүлтүүр</div>
                            <button onClick={() => setFiltersOpen(false)} aria-label="Хаах" className="w-9 h-9 border-0 rounded-[10px] bg-line text-muted flex items-center justify-center">
                                <X size={15} />
                            </button>
                        </div>
                        <div className="px-5 pt-1 pb-5">
                            {FILTER_GROUPS.map(g => (
                                <div key={g.key} className="pt-[18px] pb-1 border-b border-surface-2">
                                    <div className="text-[13.5px] font-extrabold mb-3">{g.title}</div>
                                    <div className="flex flex-wrap gap-2 pb-3">
                                        {g.values.map(v => {
                                            const active = filters[g.key].includes(v);
                                            return (
                                                <button
                                                    key={v}
                                                    onClick={() => toggleFilter(g.key, v)}
                                                    className={`h-10 px-[15px] rounded-[10px] border text-[13px] whitespace-nowrap ${active
                                                        ? 'border-primary bg-tint text-primary font-bold'
                                                        : 'border-line bg-surface-2 text-ink-3 font-semibold'}`}
                                                >
                                                    {v}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="sticky bottom-0 bg-surface border-t border-surface-2 px-5 pt-3 pb-5 flex gap-[9px]">
                            <button
                                onClick={resetFilters}
                                className="h-[50px] px-5 border border-line rounded-xl bg-surface text-ink-2 text-sm font-bold"
                            >
                                Цэвэрлэх
                            </button>
                            <button
                                onClick={() => setFiltersOpen(false)}
                                className="flex-1 h-[50px] border-0 rounded-xl bg-primary text-white text-[14.5px] font-bold"
                            >
                                {filtered.length} зар харах
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <BottomNav />
        </div>
    );
}
