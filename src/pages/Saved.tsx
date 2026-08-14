import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { CarRowCard } from '../components/CarCard';
import { getProducts, getSavedIds } from '../utils/storage';
import type { Product } from '../utils/storage';

export default function Saved() {
    const navigate = useNavigate();
    const [savedProducts, setSavedProducts] = useState<Product[]>([]);
    const [savedIds, setSavedIds] = useState<number[]>([]);

    useEffect(() => {
        const load = async () => {
            const ids = getSavedIds();
            setSavedIds(ids);
            const products = await getProducts();
            setSavedProducts(products.filter(p => ids.includes(p.id)));
        };
        load();
        window.addEventListener('storageSaved', load);
        return () => window.removeEventListener('storageSaved', load);
    }, []);

    return (
        <div className="min-h-screen bg-app text-ink">
            <Header title="Хадгалсан зар" hideLogo showBack />
            <main className="px-4 pt-4 pb-24">
                {savedProducts.length > 0 ? (
                    <div className="flex flex-col gap-3">
                        {savedProducts.map(car => (
                            <CarRowCard key={car.id} product={car} saved={savedIds.includes(car.id)} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-surface border border-line rounded-2xl px-5 py-16 text-center">
                        <Heart size={26} className="mx-auto text-muted-4" />
                        <div className="mt-3 text-[15px] font-extrabold">Хадгалсан зар байхгүй</div>
                        <div className="mt-1.5 text-[13px] text-muted">Таалагдсан машиныг ♡ дарж хадгална уу.</div>
                        <button
                            onClick={() => navigate('/search')}
                            className="mt-[18px] h-11 px-5 border-0 rounded-[11px] bg-primary text-white text-[13.5px] font-bold active:scale-95 transition-transform"
                        >
                            Машин үзэх
                        </button>
                    </div>
                )}
            </main>
            <BottomNav />
        </div>
    );
}
