import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpDown, ChevronDown, LayoutGrid, List, Rows3, X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import { CarDesktopCard, CarGridCard, CarListCard, CarRowCard } from '../components/CarCard';
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
    const [view, setView] = useState<'grid' | 'list' | 'compact'>(() => {
        const stored = localStorage.getItem('dt_view');
        return stored === 'grid' || stored === 'compact' ? stored : 'list';
    });

    useEffect(() => {
        localStorage.setItem('dt_view', view);
    }, [view]);

    useEffect(() => {
        const load = async () => setProducts(await getProducts());
        const syncSaved = () => setSavedIds(getSavedIds());
        load();
        syncSaved();
        window.addEventListener('storageSaved', syncSaved);
        return () => window.removeEventListener('storageSaved', syncSaved);
    }, []);

    // 바텀시트가 열렸을 때만 스크롤을 잠근다 (데스크탑 사이드바는 해당 없음)
    useEffect(() => {
        document.body.style.overflow = filtersOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [filtersOpen]);

    const toggleFilter = (key: keyof Filters, value: string) => {
        setFilters(f => ({
            ...f,
            [key]: f[key].includes(value) ? f[key].filter(v => v !== value) : [...f[key], value],
        }));
    };

    const resetFilters = () => setFilters(EMPTY_FILTERS);
    const refreshSaved = () => setSavedIds(getSavedIds());

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

    // 선택된 필터를 (그룹, 값) 쌍으로 펼쳐 데스크탑 상단 칩으로 보여준다
    const activeChips = FILTER_GROUPS.flatMap(g =>
        filters[g.key].map(value => ({ key: `${g.key}:${value}`, group: g.key, value }))
    );

    const chips = FILTER_GROUPS.map(g => ({
        key: g.key,
        label: g.title === 'Гүйлт' ? 'Явсан гүйлт' : g.title === 'Түлш' ? 'Шатахуун' : g.title,
        on: filters[g.key].length > 0,
    }));

    // 모바일 보기 방식 (디자인의 ▦ ☰ ▤ 토글). 선택은 브라우저에 저장.
    const VIEW_MODES = [
        { key: 'grid', Icon: LayoutGrid, label: 'Хүснэгт' },
        { key: 'list', Icon: List, label: 'Жагсаалт' },
        { key: 'compact', Icon: Rows3, label: 'Товч' },
    ] as const;

    const sortDropdown = (
        <div className="relative">
            <button
                onClick={() => setSortOpen(o => !o)}
                className="flex items-center gap-6 h-11 px-4 border border-line rounded-xl bg-surface text-[13.5px] font-bold text-ink whitespace-nowrap"
            >
                {SORT_LABELS[sort]}
                <ChevronDown size={11} className="text-muted-2" />
            </button>
            {sortOpen && (
                <>
                    <div className="fixed inset-0 z-20" onClick={() => setSortOpen(false)} />
                    <div className="absolute top-12 right-0 z-30 w-[190px] bg-surface border border-line rounded-xl shadow-2xl p-1.5 flex flex-col">
                        {SORT_OPTIONS.map(o => (
                            <button
                                key={o.key}
                                onClick={() => { setSort(o.key); setSortOpen(false); }}
                                className={`h-10 px-3 rounded-lg text-left text-[13.5px] hover:bg-surface-2 ${sort === o.key ? 'font-extrabold text-primary' : 'font-semibold text-ink-2'}`}
                            >
                                {o.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-app text-ink">
            <Header title="Автомашин" hideLogo showBack />

            {/* ===== 모바일 ===== */}
            <main className="lg:hidden pb-24">
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
                        <div className="text-[13.5px] font-bold flex-none truncate">
                            {filtered.length} машин{query ? ` · "${query}"` : ''}
                        </div>
                        <div className="flex items-center gap-2 flex-none">
                            {/* 정렬: 아이콘 버튼 (기존 바텀시트 재사용) */}
                            <button
                                onClick={() => setSortOpen(true)}
                                aria-label={`Эрэмбэлэх: ${SORT_LABELS[sort]}`}
                                className={`w-[42px] h-[42px] border rounded-xl bg-surface flex items-center justify-center ${sort !== 'recommended' ? 'border-primary text-primary' : 'border-line text-ink'}`}
                            >
                                <ArrowUpDown size={16} />
                            </button>
                            {/* 보기 방식 토글 (디자인의 ▦ ☰ ▤) */}
                            <div className="flex gap-0.5 p-1 border border-line rounded-xl bg-surface">
                                {VIEW_MODES.map(({ key, Icon, label }) => (
                                    <button
                                        key={key}
                                        onClick={() => setView(key)}
                                        aria-label={label}
                                        className={`w-10 h-[34px] rounded-[9px] flex items-center justify-center transition-colors ${view === key ? 'bg-ink-block text-white' : 'text-muted-3'}`}
                                    >
                                        <Icon size={15} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

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

                {view === 'grid' ? (
                    <div className="grid grid-cols-2 gap-x-3 gap-y-4 px-4 pt-3">
                        {filtered.map(car => (
                            <CarGridCard key={car.id} product={car} saved={savedIds.includes(car.id)} onSavedChange={refreshSaved} />
                        ))}
                    </div>
                ) : view === 'compact' ? (
                    <div className="flex flex-col gap-2.5 px-4 pt-3">
                        {filtered.map(car => (
                            <CarRowCard key={car.id} product={car} saved={savedIds.includes(car.id)} onSavedChange={refreshSaved} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 px-4 pt-3">
                        {filtered.map(car => (
                            <CarListCard key={car.id} product={car} saved={savedIds.includes(car.id)} onSavedChange={refreshSaved} />
                        ))}
                    </div>
                )}
            </main>

            {/* ===== 데스크탑 (사이드바 + 3열) ===== */}
            <main className="hidden lg:grid max-w-[1280px] mx-auto px-6 pt-6 pb-20 grid-cols-[280px_1fr] gap-7 items-start">
                <aside className="sticky top-[92px] bg-surface border border-line rounded-2xl px-[18px] pt-[18px] pb-[22px]">
                    <div className="flex items-center justify-between pb-4 border-b border-surface-2">
                        <div className="flex items-center gap-2.5">
                            <span className="w-[30px] h-[30px] rounded-full bg-ink-block text-white flex items-center justify-center text-[13px]">▽</span>
                            <span className="text-[15.5px] font-extrabold tracking-tight">Шүүлтүүр</span>
                        </div>
                        <button
                            onClick={resetFilters}
                            className="border-0 bg-transparent p-0 text-[12.5px] font-semibold text-muted-2 hover:text-primary transition-colors"
                        >
                            Цэвэрлэх
                        </button>
                    </div>

                    <div className="flex flex-col gap-4 pt-[18px]">
                        {FILTER_GROUPS.map(g => (
                            <div key={g.key} className="flex flex-col gap-[7px]">
                                <span className="text-xs font-bold text-ink-3">{g.title}</span>
                                <div className="flex flex-col gap-0.5">
                                    {g.values.map(v => {
                                        const active = filters[g.key].includes(v);
                                        return (
                                            <button
                                                key={v}
                                                onClick={() => toggleFilter(g.key, v)}
                                                className="flex items-center gap-2.5 py-[7px] border-0 bg-transparent text-left"
                                            >
                                                <span className={`flex-none w-[18px] h-[18px] rounded-[5px] border flex items-center justify-center text-[11px] font-bold ${active ? 'bg-primary border-primary text-white' : 'border-line-2 text-transparent'}`}>
                                                    ✓
                                                </span>
                                                <span className={`text-[13px] ${active ? 'font-bold text-ink' : 'font-semibold text-ink-3'}`}>
                                                    {v}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                <section>
                    {activeChips.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            {activeChips.map(c => (
                                <button
                                    key={c.key}
                                    onClick={() => toggleFilter(c.group, c.value)}
                                    className="h-8 pl-3 pr-2.5 inline-flex items-center gap-[7px] rounded-lg border border-primary bg-tint text-primary text-[12.5px] font-bold whitespace-nowrap"
                                >
                                    {c.value} <X size={12} />
                                </button>
                            ))}
                            <button
                                onClick={resetFilters}
                                className="border-0 bg-transparent text-muted text-[12.5px] font-bold"
                            >
                                Бүгдийг цэвэрлэх
                            </button>
                        </div>
                    )}

                    <div className="flex items-center justify-between mb-3.5">
                        <div className="text-sm font-bold">
                            {filtered.length} машин{query ? ` · "${query}"` : ''}
                        </div>
                        {sortDropdown}
                    </div>

                    {filtered.length === 0 ? (
                        <div className="bg-surface border border-line rounded-2xl px-6 py-14 text-center">
                            <div className="text-[15px] font-extrabold">Тохирох зар олдсонгүй</div>
                            <div className="mt-1.5 text-[13.5px] text-muted">Шүүлтүүрээ багасгаад дахин оролдоно уу.</div>
                            <button
                                onClick={resetFilters}
                                className="mt-[18px] h-[42px] px-5 border-0 rounded-[10px] bg-primary text-white text-[13.5px] font-bold"
                            >
                                Шүүлтүүр цэвэрлэх
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-[18px]">
                            {filtered.map(car => (
                                <CarDesktopCard key={car.id} product={car} saved={savedIds.includes(car.id)} onSavedChange={refreshSaved} />
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* 모바일 정렬 바텀시트 (데스크탑은 sortDropdown 사용) */}
            {sortOpen && (
                <div className="lg:hidden fixed inset-0 z-[55] bg-black/70 flex items-end justify-center" onClick={() => setSortOpen(false)}>
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

            {/* 모바일 필터 바텀시트 */}
            {filtersOpen && (
                <div className="lg:hidden fixed inset-0 z-50 bg-black/70 flex items-end justify-center" onClick={() => setFiltersOpen(false)}>
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

            <Footer />
            <BottomNav />
        </div>
    );
}
