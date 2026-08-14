import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Check, Heart, ReceiptText } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookingSheet from '../components/BookingSheet';
import PriceBreakdownSheet from '../components/PriceBreakdownSheet';
import Image from '../components/Image';
import { COMPANY, fuelLabel } from '../constants/company';
import { OPTION_CATEGORIES, VEHICLE_OPTIONS } from '../constants/vehicleOptions';
import { addToRecentlyViewed, getProducts, isSaved, toggleSaved } from '../utils/storage';
import type { Product } from '../utils/storage';

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [similar, setSimilar] = useState<Product[]>([]);
    const [activeImage, setActiveImage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const [bookingOpen, setBookingOpen] = useState(false);
    const [breakdownOpen, setBreakdownOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        setActiveImage(0);

        const load = async () => {
            if (id) {
                const products = await getProducts();
                const found = products.find(p => p.id === Number(id)) || null;
                setProduct(found);
                if (found) {
                    setSaved(isSaved(found.id));
                    addToRecentlyViewed(found.id);
                    setSimilar(products.filter(p => p.categoryId === found.categoryId && p.id !== found.id).slice(0, 4));
                }
            }
            setLoading(false);
        };
        load();
    }, [id]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-app text-muted">
                <div className="w-9 h-9 border-4 border-line border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-app text-muted gap-4">
                <p>Бүтээгдэхүүн олдсонгүй</p>
                <button onClick={() => navigate('/')} className="text-primary font-bold">Нүүр хуудас руу буцах</button>
            </div>
        );
    }

    const images = product.images?.length ? product.images : [];
    const meta = [product.year, product.mileage, fuelLabel(product.fuel)].filter(Boolean).join(' · ');
    const sold = product.status === 'sold';

    const specs = [
        { k: 'Он', v: product.year },
        { k: 'Гүйлт', v: product.mileage },
        { k: 'Түлш', v: fuelLabel(product.fuel) },
        { k: 'Хөдөлгүүр', v: product.engine || '' },
        { k: 'Хурдны хайрцаг', v: product.transmission || '' },
        { k: 'Хөтлөгч', v: product.drive || '' },
        { k: 'Өнгө', v: product.color || '' },
        { k: 'Дотор өнгө', v: product.interiorColor || '' },
        { k: 'Хаалга', v: product.doors || '' },
    ].filter(s => s.v && s.v !== '-');

    // 옵션을 카테고리별로 그룹화 (디자인의 have/total 뱃지)
    const ownedOptions = new Set(product.options || []);
    const optionGroups = (Object.keys(OPTION_CATEGORIES) as (keyof typeof OPTION_CATEGORIES)[])
        .map(cat => {
            const items = VEHICLE_OPTIONS.filter(o => o.category === cat);
            return { title: OPTION_CATEGORIES[cat], items, on: items.filter(o => ownedOptions.has(o.id)).length };
        })
        .filter(g => g.on > 0);
    const optHave = optionGroups.reduce((n, g) => n + g.on, 0);
    const optTotal = optionGroups.reduce((n, g) => n + g.items.length, 0);

    const handleSave = () => {
        toggleSaved(product.id);
        setSaved(isSaved(product.id));
    };

    const tags = (
        <div className="flex gap-1.5 flex-wrap">
            {sold && <span className="text-[11px] font-bold text-white bg-muted-3 rounded-[5px] px-2 py-[5px]">Зарагдсан</span>}
            {product.status === 'discounted' && (
                <span className="text-[11px] font-bold text-primary bg-tint rounded-[5px] px-2 py-[5px]">Хямдарсан</span>
            )}
            {product.tags?.map((tag, i) => (
                <span key={i} className="text-[11px] font-bold text-primary bg-tint rounded-[5px] px-2 py-[5px] whitespace-nowrap">
                    {tag}
                </span>
            ))}
        </div>
    );

    const optionsBlock = optionGroups.map(g => (
        <div key={g.title} className="py-3.5 lg:py-5 border-t border-surface-2">
            <div className="flex items-baseline gap-2 mb-2.5 lg:mb-3.5">
                <span className="text-[13.5px] lg:text-sm font-extrabold">{g.title}</span>
                <span className="text-[11.5px] lg:text-xs font-bold text-primary">{g.on}/{g.items.length}</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 lg:gap-x-3.5 gap-y-1.5 lg:gap-y-2">
                {g.items.map(o => {
                    const active = ownedOptions.has(o.id);
                    return (
                        <div key={o.id} className="flex items-center gap-2 lg:gap-2.5 min-w-0 py-1 lg:py-[7px]">
                            <span className={`flex-none w-[17px] h-[17px] rounded-full flex items-center justify-center ${active ? 'bg-primary text-white' : 'bg-line text-muted-4'}`}>
                                <Check size={10} strokeWidth={3.5} />
                            </span>
                            <span className={`text-[12.5px] truncate ${active ? 'font-semibold text-ink' : 'font-medium text-muted-3'}`}>
                                {o.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    ));

    const similarBlock = similar.length > 0 && (
        <>
            <div className="flex items-baseline justify-between px-4 lg:px-0 pb-3 lg:mt-9 lg:mb-3.5">
                <h2 className="m-0 text-base lg:text-[19px] font-extrabold tracking-tight">Ижил төстэй зар</h2>
                <Link to="/search" className="text-[13px] lg:text-[13.5px] font-bold text-primary">Бүгдийг харах →</Link>
            </div>
            <div className="flex gap-3 overflow-x-auto px-4 no-scrollbar lg:grid lg:grid-cols-4 lg:gap-3.5 lg:overflow-visible lg:px-0">
                {similar.map(car => (
                    <Link
                        key={car.id}
                        to={`/product/${car.id}`}
                        className="flex-none w-[190px] lg:w-auto border border-line rounded-[14px] overflow-hidden bg-surface hover:border-line-2 transition-colors"
                    >
                        <div className="aspect-[4/3] bg-surface-2 flex items-center justify-center overflow-hidden">
                            {car.images?.[0] ? (
                                <Image src={car.images[0]} alt={car.name} className="w-full h-full object-cover" size="thumbnail" />
                            ) : (
                                <span className="text-[10.5px] font-bold tracking-[0.1em] text-muted-3">ЗУРАГ</span>
                            )}
                        </div>
                        <div className="px-[13px] pt-3 pb-3.5">
                            <div className="text-[13px] lg:text-[13.5px] font-bold truncate">{car.name}</div>
                            <div className="mt-1 text-[11.5px] lg:text-xs font-medium text-muted truncate">
                                {[car.year, car.mileage].filter(Boolean).join(' · ')}
                            </div>
                            <div className="mt-2 text-[14.5px] lg:text-[15px] font-extrabold text-primary">{car.price}</div>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-app text-ink">
            <Header showBack hideLogo />

            {/* ===== 모바일 ===== */}
            <main className="lg:hidden pb-[116px]">
                <div className="relative aspect-[4/3] bg-surface-2">
                    {images.length > 0 ? (
                        <div
                            className="w-full h-full overflow-x-auto snap-x snap-mandatory flex no-scrollbar"
                            onScroll={e => {
                                const el = e.currentTarget;
                                setActiveImage(Math.round(el.scrollLeft / el.clientWidth));
                            }}
                        >
                            {images.map((img, idx) => (
                                <div key={idx} className="w-full h-full flex-shrink-0 snap-center flex items-center justify-center bg-black">
                                    <Image src={img} alt={`${product.name} - ${idx + 1}`} className="max-w-full max-h-full object-contain" size="full" priority={idx === 0} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[11.5px] font-bold tracking-[0.12em] text-muted-3">
                            ГОЛ ЗУРАГ
                        </div>
                    )}
                    {images.length > 1 && (
                        <div className="absolute bottom-3 right-3.5 text-[11.5px] font-bold text-white bg-slate-900/60 rounded-[20px] px-[11px] py-[5px]">
                            {activeImage + 1} / {images.length}
                        </div>
                    )}
                </div>

                <div className="bg-surface px-4 pt-5 pb-[22px] border-b border-line">
                    {tags}
                    <h1 className="mt-3 text-[21px] font-extrabold tracking-tight leading-[1.3]">{product.name}</h1>
                    <div className="mt-1.5 text-[13px] font-medium text-muted">{meta}</div>
                    <div className="mt-[18px] text-[12.5px] font-bold text-ink">Машины үнэ</div>
                    <div className="mt-1 text-[28px] font-extrabold tracking-tight">{product.price}</div>
                    {product.priceKRW ? (
                        <div className="mt-[3px] text-[12.5px] font-medium text-muted-2">
                            Солонгост ₩{product.priceKRW.toLocaleString()}
                        </div>
                    ) : null}
                    {product.priceKRW ? (
                        <button
                            onClick={() => setBreakdownOpen(true)}
                            className="mt-3.5 w-full h-11 border border-line rounded-xl bg-surface-2 text-[13.5px] font-bold text-ink flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                        >
                            <ReceiptText size={15} className="text-primary" />
                            Үнийн задаргаа харах
                        </button>
                    ) : null}
                </div>

                {specs.length > 0 && (
                    <div className="bg-surface mt-3 px-4 py-5">
                        <div className="text-base font-extrabold tracking-tight mb-3.5">Үндсэн үзүүлэлт</div>
                        <div className="grid grid-cols-2 gap-3">
                            {specs.map(s => (
                                <div key={s.k} className="bg-surface-2 rounded-[11px] px-[13px] py-3">
                                    <div className="text-[11.5px] font-semibold text-muted-2">{s.k}</div>
                                    <div className="mt-1 text-[13.5px] font-bold">{s.v}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {optionGroups.length > 0 && (
                    <div className="bg-surface mt-3 px-4 py-5">
                        <div className="flex items-baseline justify-between mb-3.5">
                            <div className="text-base font-extrabold tracking-tight">Нэмэлт тоноглол</div>
                            <span className="text-[12.5px] font-bold text-muted-2">{optHave} / {optTotal}</span>
                        </div>
                        {optionsBlock}
                    </div>
                )}

                <div className="bg-surface mt-3 px-4 py-5">
                    <div className="text-base font-extrabold tracking-tight mb-3">Тайлбар</div>
                    <p className="m-0 text-[13.5px] leading-[1.75] text-ink-2 whitespace-pre-wrap">
                        {product.description || 'Тайлбар байхгүй байна.'}
                    </p>
                </div>

                {similar.length > 0 && (
                    <div className="mt-3 bg-surface pt-5 pb-[22px]">{similarBlock}</div>
                )}
            </main>

            {/* 모바일 하단 고정 CTA */}
            <div className="lg:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[35] bg-surface border-t border-line px-4 pt-3 pb-4 flex gap-2.5 box-border">
                <button
                    onClick={handleSave}
                    aria-label="Хадгалах"
                    className="w-14 h-[52px] flex-none border border-line rounded-[13px] bg-surface flex items-center justify-center text-muted active:scale-95 transition-transform"
                >
                    <Heart size={19} fill={saved ? '#FF1A1A' : 'none'} className={saved ? 'text-primary' : ''} />
                </button>
                <button
                    onClick={() => setBookingOpen(true)}
                    disabled={sold}
                    className="flex-1 h-[52px] border-0 rounded-[13px] bg-primary text-white text-[15px] font-bold active:scale-[0.98] transition-transform disabled:opacity-50"
                >
                    {sold ? 'Зарагдсан' : 'Захиалга өгөх'}
                </button>
            </div>

            {/* ===== 데스크탑 (본문 + 고정 사이드바) ===== */}
            <main className="hidden lg:block max-w-[1280px] mx-auto px-6 pt-5 pb-20">
                <div className="text-[12.5px] font-semibold text-muted-2 mb-4">
                    <Link to="/search" className="text-muted-2 hover:text-primary">Автомашин</Link> · {product.name}
                </div>

                <div className="grid grid-cols-[1fr_380px] gap-7 items-start">
                    <div>
                        <div className="aspect-[16/10] rounded-[18px] bg-surface-2 border border-line flex items-center justify-center overflow-hidden">
                            {images[activeImage] ? (
                                <Image src={images[activeImage]} alt={product.name} className="w-full h-full object-cover" size="full" priority />
                            ) : (
                                <span className="text-xs font-bold tracking-[0.12em] text-muted-3">ГОЛ ЗУРАГ</span>
                            )}
                        </div>
                        {images.length > 1 && (
                            <div className="grid grid-cols-5 gap-2.5 mt-2.5">
                                {images.slice(0, 10).map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        aria-label={`${i + 1}-р зураг`}
                                        className={`aspect-[4/3] rounded-[10px] overflow-hidden border transition-colors ${i === activeImage ? 'border-primary' : 'border-line hover:border-line-2'}`}
                                    >
                                        <Image src={img} alt="" className="w-full h-full object-cover" size="thumbnail" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {specs.length > 0 && (
                            <>
                                <h2 className="mt-9 mb-3.5 text-[19px] font-extrabold tracking-tight">Үндсэн үзүүлэлт</h2>
                                <div className="bg-surface border border-line rounded-2xl px-6 py-2">
                                    {specs.map((s, i) => (
                                        <div
                                            key={s.k}
                                            className={`grid grid-cols-[180px_1fr] py-[15px] ${i < specs.length - 1 ? 'border-b border-surface-2' : ''}`}
                                        >
                                            <span className="text-[13.5px] font-semibold text-muted-2">{s.k}</span>
                                            <span className="text-[13.5px] font-bold">{s.v}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {optionGroups.length > 0 && (
                            <>
                                <div className="flex items-baseline justify-between mt-9 mb-3.5">
                                    <h2 className="m-0 text-[19px] font-extrabold tracking-tight">Нэмэлт тоноглол</h2>
                                    <span className="text-[13px] font-bold text-muted-2">{optHave} / {optTotal}</span>
                                </div>
                                <div className="bg-surface border border-line rounded-2xl px-6 pt-1 pb-5">{optionsBlock}</div>
                            </>
                        )}

                        <h2 className="mt-9 mb-3.5 text-[19px] font-extrabold tracking-tight">Тайлбар</h2>
                        <p className="m-0 bg-surface border border-line rounded-2xl px-6 py-[22px] text-[14.5px] leading-[1.75] text-ink-2 whitespace-pre-wrap [text-wrap:pretty]">
                            {product.description || 'Тайлбар байхгүй байна.'}
                        </p>

                        {similarBlock}
                    </div>

                    <aside className="sticky top-[92px] flex flex-col gap-3.5">
                        <div className="bg-surface border border-line rounded-[18px] p-6">
                            <div className="mb-3">{tags}</div>
                            <h1 className="m-0 text-2xl font-extrabold tracking-tight leading-[1.3]">{product.name}</h1>
                            <div className="mt-2 text-[13.5px] font-medium text-muted">{meta}</div>
                            <div className="mt-[22px] pt-5 border-t border-line">
                                <div className="text-[12.5px] font-bold text-ink-3">Машины үнэ</div>
                                <div className="mt-1.5 text-[32px] font-extrabold tracking-tight">{product.price}</div>
                                {product.priceKRW ? (
                                    <div className="mt-1 text-[13px] font-medium text-muted-2">
                                        Солонгост ₩{product.priceKRW.toLocaleString()}
                                    </div>
                                ) : null}
                                {product.priceKRW ? (
                                    <button
                                        onClick={() => setBreakdownOpen(true)}
                                        className="mt-4 w-full h-11 border border-line rounded-xl bg-surface-2 text-[13.5px] font-bold text-ink flex items-center justify-center gap-2 hover:border-primary transition-colors"
                                    >
                                        <ReceiptText size={15} className="text-primary" />
                                        Үнийн задаргаа харах
                                    </button>
                                ) : null}
                            </div>
                            <div className="flex flex-col gap-[9px] mt-[22px]">
                                <button
                                    onClick={() => setBookingOpen(true)}
                                    disabled={sold}
                                    className="h-[50px] border-0 rounded-xl bg-primary text-white text-[15px] font-bold disabled:opacity-50 hover:bg-primary-dark transition-colors"
                                >
                                    {sold ? 'Зарагдсан' : 'Захиалга өгөх'}
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="h-[50px] border border-line rounded-xl bg-surface text-ink text-[15px] font-bold flex items-center justify-center gap-2 hover:border-line-2 transition-colors"
                                >
                                    <Heart size={17} fill={saved ? '#FF1A1A' : 'none'} className={saved ? 'text-primary' : ''} />
                                    Хадгалах
                                </button>
                            </div>
                        </div>

                        <div className="bg-black rounded-[18px] px-6 py-[22px]">
                            <div className="text-xs font-bold tracking-[0.1em] text-white/50">{COMPANY.name}</div>
                            <div className="mt-2.5 text-[17px] font-extrabold text-white">{COMPANY.phoneMain}</div>
                            <div className="mt-[3px] text-sm font-bold text-white/[.62]">{COMPANY.phoneSub}</div>
                            <div className="mt-3.5 text-[12.5px] leading-[1.6] text-white/[.62]">{COMPANY.address}</div>
                        </div>
                    </aside>
                </div>
            </main>

            <Footer />
            <BookingSheet product={product} open={bookingOpen} onClose={() => setBookingOpen(false)} />
            <PriceBreakdownSheet product={product} open={breakdownOpen} onClose={() => setBreakdownOpen(false)} />
        </div>
    );
}
