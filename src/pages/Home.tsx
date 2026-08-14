import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import Image from '../components/Image';
import HeroCarousel from '../components/HeroCarousel';
import { CarDesktopCard, CarGridCard } from '../components/CarCard';
import { getBanners, getCategories, getProducts, getSavedIds } from '../utils/storage';
import type { Banner, Category, Product } from '../utils/storage';

export default function Home() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [banner, setBanner] = useState<Banner | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [savedIds, setSavedIds] = useState<number[]>([]);

    useEffect(() => {
        const load = async () => {
            const [banners, cats, prods] = await Promise.all([
                getBanners(),
                getCategories(),
                getProducts(),
            ]);
            setBanner(banners.find(b => b.active) || null);
            setCategories(cats);
            setProducts(prods.filter(p => p.status === 'active' || p.status === 'pending' || p.status === 'discounted'));
        };
        const syncSaved = () => setSavedIds(getSavedIds());

        load();
        syncSaved();
        window.addEventListener('storageProducts', load);
        window.addEventListener('storageSaved', syncSaved);
        return () => {
            window.removeEventListener('storageProducts', load);
            window.removeEventListener('storageSaved', syncSaved);
        };
    }, []);

    const submitSearch = () => {
        navigate(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : '/search');
    };

    const refreshSaved = () => setSavedIds(getSavedIds());
    const mobileCars = products.slice(0, 4);
    const desktopCars = products.slice(0, 8);

    return (
        <div className="min-h-screen bg-app text-ink">
            <Header />

            {/* ===== 모바일 (430px 디자인) ===== */}
            <main className="lg:hidden pt-4 pb-6">
                <div className="px-4">
                    <div className="flex items-center gap-[9px] h-12 px-3.5 rounded-[14px] bg-surface border border-line">
                        <SearchIcon size={16} className="text-muted-2 flex-none" />
                        <input
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') submitSearch(); }}
                            placeholder="Та ямар машин хайж байна?"
                            className="flex-1 min-w-0 border-0 outline-none bg-transparent text-sm font-medium text-ink placeholder:text-muted-2"
                        />
                        {query && (
                            <button onClick={() => setQuery('')} aria-label="Цэвэрлэх" className="border-0 bg-transparent text-muted-2">
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-4 px-4">
                    <div
                        className="relative rounded-[18px] overflow-hidden px-[22px] pt-6 pb-[22px]"
                        style={{ background: 'linear-gradient(130deg, #0D0D0D 0%, #2A0A0A 55%, #B70000 100%)' }}
                    >
                        {banner?.image && (
                            <div className="absolute inset-0 opacity-40">
                                <Image src={banner.image} alt="" className="w-full h-full object-cover" size="medium" priority />
                            </div>
                        )}
                        <div className="relative">
                            <div className="mt-2.5 text-[22px] font-extrabold leading-[1.3] text-white tracking-tight">
                                {banner?.title || <>Солонгосоос шууд,<br />шалгагдсан автомашин</>}
                            </div>
                            <div className="mt-2 text-[12.5px] text-white/[.72] leading-[1.55]">
                                {banner?.subtitle || 'Гааль, тээвэр, бүртгэл — бүгд багцад.'}
                            </div>
                        </div>
                    </div>
                </div>

                {categories.length > 0 && (
                    <div className="mt-4 flex gap-2 overflow-x-auto px-4 no-scrollbar">
                        {categories.map(c => (
                            <Link
                                key={c.id}
                                to={`/category/${c.id}`}
                                className="flex-none h-11 px-4 border border-line rounded-[22px] bg-surface text-[13px] font-bold text-ink whitespace-nowrap flex items-center gap-1.5"
                            >
                                {c.name}
                                {c.count > 0 && <span className="text-muted-2 font-semibold">{c.count}</span>}
                            </Link>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-between px-4 pt-[26px] pb-3">
                    <div className="text-lg font-extrabold tracking-tight">Шинэ зар</div>
                </div>
                {mobileCars.length > 0 ? (
                    <div className="grid grid-cols-2 gap-x-3 gap-y-4 px-4">
                        {mobileCars.map(car => (
                            <CarGridCard key={car.id} product={car} saved={savedIds.includes(car.id)} onSavedChange={refreshSaved} />
                        ))}
                    </div>
                ) : (
                    <div className="mx-4 bg-surface border border-line rounded-2xl py-12 text-center text-[13px] text-muted">
                        Одоогоор зар байхгүй байна.
                    </div>
                )}
                <div className="px-4 pt-5">
                    <button
                        onClick={() => navigate('/search')}
                        className="w-full h-[52px] border border-line rounded-[13px] bg-surface text-[14.5px] font-bold text-ink active:scale-[0.98] transition-transform"
                    >
                        Дэлгэрэнгүй харах
                    </button>
                </div>
            </main>

            {/* ===== 데스크탑 (1280px 디자인) ===== */}
            <main className="hidden lg:block max-w-[1280px] mx-auto px-6 pt-7 pb-20">
                <HeroCarousel />

                {categories.length > 0 && (
                    <section className="mb-11">
                        <div className="flex items-baseline justify-between mb-4">
                            <h2 className="m-0 text-[22px] font-extrabold tracking-tight">Категори</h2>
                            <Link to="/categories" className="text-[13.5px] font-bold text-primary">Бүгдийг харах →</Link>
                        </div>
                        <div className="flex flex-wrap gap-3.5">
                            {categories.map(c => (
                                <Link
                                    key={c.id}
                                    to={`/category/${c.id}`}
                                    className="flex items-center gap-3 h-[62px] px-5 bg-surface border border-line rounded-2xl hover:border-primary transition-colors"
                                >
                                    <span className="w-[34px] h-[34px] flex-none rounded-full bg-line text-muted flex items-center justify-center text-xs font-extrabold tracking-tight">
                                        {c.name.slice(0, 2).toUpperCase()}
                                    </span>
                                    <span className="text-sm font-extrabold tracking-[0.02em]">{c.name}</span>
                                    {c.count > 0 && <span className="text-[13px] font-semibold text-muted-2">{c.count}</span>}
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                <section>
                    <div className="flex items-baseline justify-between mb-4">
                        <h2 className="m-0 text-[22px] font-extrabold tracking-tight">Сүүлд нэмэгдсэн</h2>
                        <Link to="/search" className="text-[13.5px] font-bold text-primary">Бүгдийг харах →</Link>
                    </div>
                    {desktopCars.length > 0 ? (
                        <div className="grid grid-cols-4 gap-4">
                            {desktopCars.map(car => (
                                <CarDesktopCard key={car.id} product={car} saved={savedIds.includes(car.id)} onSavedChange={refreshSaved} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-surface border border-line rounded-2xl py-16 text-center text-sm text-muted">
                            Одоогоор зар байхгүй байна.
                        </div>
                    )}
                </section>
            </main>

            <Footer />
            <BottomNav />
        </div>
    );
}
