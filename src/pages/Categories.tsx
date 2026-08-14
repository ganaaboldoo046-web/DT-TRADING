import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import Image from '../components/Image';
import { getCategories, getProducts } from '../utils/storage';
import type { Category } from '../utils/storage';

export default function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const load = async () => {
            const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
            // DB의 count 컬럼이 비어 있을 수 있어 실제 매물 수로 보정한다
            setCategories(cats.map(c => ({
                ...c,
                count: prods.filter(p => p.categoryId === c.id).length || c.count,
            })));
            setTotal(prods.length);
        };
        load();
    }, []);

    return (
        <div className="min-h-screen bg-app text-ink">
            <Header title="Категори" hideLogo showBack />
            <main className="max-w-[1280px] mx-auto px-4 lg:px-6 pt-4 lg:pt-8 pb-24 lg:pb-20">
                <h1 className="hidden lg:block m-0 mb-1.5 text-[30px] font-extrabold tracking-tight">Категори</h1>
                <p className="m-0 mb-5 lg:mb-7 text-[13px] lg:text-[14.5px] text-muted">
                    Нийт {total.toLocaleString()} зараас төрлөөр нь сонгоно уу.
                </p>

                {categories.length === 0 ? (
                    <div className="bg-surface border border-line rounded-2xl py-14 text-center text-[13px] text-muted">
                        Категори бүртгэгдээгүй байна.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-[18px]">
                        {categories.map(c => (
                            <Link
                                key={c.id}
                                to={`/category/${c.id}`}
                                className="bg-surface border border-line rounded-2xl overflow-hidden hover:border-primary transition-colors"
                            >
                                <div className={`aspect-[16/9] flex items-center justify-center overflow-hidden ${c.image ? 'bg-white p-8' : 'bg-surface-2'}`}>
                                    {c.image ? (
                                        <Image src={c.image} alt={c.name} className="w-full h-full object-contain" size="medium" />
                                    ) : (
                                        <span className="text-[11px] font-bold tracking-[0.12em] text-muted-3">ЗУРАГ</span>
                                    )}
                                </div>
                                <div className="px-5 pt-4 pb-5 flex items-center justify-between">
                                    <div>
                                        <div className="text-base font-extrabold tracking-tight">{c.name}</div>
                                        <div className="mt-1 text-[13px] font-semibold text-muted-2">{c.count} зар</div>
                                    </div>
                                    <span className="text-lg text-primary">→</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
            <BottomNav />
        </div>
    );
}
