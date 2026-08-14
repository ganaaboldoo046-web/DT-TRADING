import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronDown, X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import { CarDesktopCard, CarListCard } from '../components/CarCard';
import { getCategories, getProducts, getSavedIds } from '../utils/storage';
import type { Category, Product } from '../utils/storage';

type SortKey = 'newest' | 'priceAsc' | 'priceDesc' | 'yearDesc';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: 'newest', label: 'Шинэ зар эхэлж' },
    { key: 'priceAsc', label: 'Үнэ багаас их рүү' },
    { key: 'priceDesc', label: 'Үнэ ихээс бага руу' },
    { key: 'yearDesc', label: 'Он шинээс' },
];

const num = (s: string) => Number(String(s).replace(/[^0-9]/g, '')) || 0;

export default function CategoryDetail() {
    const { id } = useParams();
    const [category, setCategory] = useState<Category | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [savedIds, setSavedIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState<SortKey>('newest');
    const [sortOpen, setSortOpen] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
                const catId = Number(id);
                setCategory(cats.find(c => c.id === catId) || null);
                setProducts(prods.filter(p => p.categoryId === catId));
            } finally {
                setLoading(false);
            }
        };
        const syncSaved = () => setSavedIds(getSavedIds());
        load();
        syncSaved();
        window.addEventListener('storageSaved', syncSaved);
        return () => window.removeEventListener('storageSaved', syncSaved);
    }, [id]);

    const sorted = useMemo(() => {
        const result = [...products];
        switch (sort) {
            case 'priceAsc': result.sort((a, b) => num(a.price) - num(b.price)); break;
            case 'priceDesc': result.sort((a, b) => num(b.price) - num(a.price)); break;
            case 'yearDesc': result.sort((a, b) => num(b.year) - num(a.year)); break;
            default: result.sort((a, b) => (b.id || 0) - (a.id || 0));
        }
        return result;
    }, [products, sort]);

    return (
        <div className="min-h-screen bg-app text-ink">
            <Header title={category?.name || 'Ангилал'} hideLogo showBack />
            <main className="max-w-[1280px] mx-auto pb-24 lg:pb-20 lg:px-6 lg:pt-8">
                <h1 className="hidden lg:block m-0 mb-5 text-[30px] font-extrabold tracking-tight">
                    {category?.name || 'Ангилал'}
                </h1>
                <div className="flex items-center justify-between gap-2.5 px-4 lg:px-0 pt-3 lg:pt-0">
                    <div className="text-[13.5px] lg:text-sm font-bold flex-none">{sorted.length} машин</div>
                    <button
                        onClick={() => setSortOpen(true)}
                        className="flex items-center gap-2.5 h-[42px] px-3.5 border border-line rounded-xl bg-surface text-[13px] font-bold text-ink whitespace-nowrap"
                    >
                        {SORT_OPTIONS.find(o => o.key === sort)?.label}
                        <ChevronDown size={11} className="text-muted-2" />
                    </button>
                </div>

                {loading ? (
                    <div className="py-20 flex justify-center">
                        <div className="w-9 h-9 border-4 border-line border-t-primary rounded-full animate-spin" />
                    </div>
                ) : sorted.length === 0 ? (
                    <div className="mx-4 lg:mx-0 my-3 lg:my-4 bg-surface border border-line rounded-2xl px-5 py-12 lg:py-16 text-center">
                        <div className="text-[15px] font-extrabold">Энэ ангилалд зар алга</div>
                        <div className="mt-1.5 text-[13px] text-muted">Удахгүй шинэ зар нэмэгдэнэ.</div>
                    </div>
                ) : (
                    <>
                        <div className="lg:hidden flex flex-col gap-3 px-4 pt-3">
                            {sorted.map(car => (
                                <CarListCard
                                    key={car.id}
                                    product={car}
                                    saved={savedIds.includes(car.id)}
                                    onSavedChange={() => setSavedIds(getSavedIds())}
                                />
                            ))}
                        </div>
                        <div className="hidden lg:grid grid-cols-4 gap-4 pt-4">
                            {sorted.map(car => (
                                <CarDesktopCard
                                    key={car.id}
                                    product={car}
                                    saved={savedIds.includes(car.id)}
                                    onSavedChange={() => setSavedIds(getSavedIds())}
                                />
                            ))}
                        </div>
                    </>
                )}
            </main>

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

            <Footer />
            <BottomNav />
        </div>
    );
}
