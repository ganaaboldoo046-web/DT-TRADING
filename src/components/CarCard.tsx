import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Image from './Image';
import { fuelLabel } from '../constants/company';
import { toggleSaved } from '../utils/storage';
import type { Product } from '../utils/storage';

interface CarCardProps {
    product: Product;
    saved: boolean;
    /** 저장 토글 후 상위 상태 갱신용 */
    onSavedChange?: () => void;
}

const metaOf = (p: Product) =>
    [p.year, p.mileage, fuelLabel(p.fuel)].filter(Boolean).join(' · ');

/** 홈 그리드용 카드 (1:1 이미지, 2열) */
export function CarGridCard({ product, saved, onSavedChange }: CarCardProps) {
    return (
        <Link to={`/product/${product.id}`} className="block min-w-0">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-surface-2">
                {product.images?.[0] ? (
                    <Image src={product.images[0]} alt={product.name} className="w-full h-full object-cover" size="thumbnail" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10.5px] font-bold tracking-[0.12em] text-muted-3">
                        ЗУРАГ
                    </div>
                )}
                <span className="absolute top-2 left-2 text-[10.5px] font-extrabold text-white bg-primary rounded-[5px] px-1.5 py-[3px]">
                    Шалгасан
                </span>
                <button
                    onClick={e => {
                        e.preventDefault();
                        toggleSaved(product.id);
                        onSavedChange?.();
                    }}
                    aria-label="Хадгалах"
                    className="absolute top-1 right-1 w-11 h-11 border-0 bg-transparent flex items-center justify-center text-white/90"
                >
                    <Heart size={19} fill={saved ? '#FF1A1A' : 'none'} className={saved ? 'text-primary' : ''} />
                </button>
                {product.status === 'sold' && (
                    <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                        <span className="text-white text-xs font-extrabold px-2.5 py-1 bg-black/50 rounded-lg">Зарагдсан</span>
                    </div>
                )}
            </div>
            <div className="mt-2.5 text-sm font-bold leading-[1.4] tracking-tight line-clamp-2">{product.name}</div>
            <div className="mt-1.5 text-xs font-medium text-muted-2">{product.year} · {product.mileage}</div>
            <div className="mt-2 text-base font-extrabold tracking-tight">{product.price}</div>
        </Link>
    );
}

/** 검색/목록용 카드 (16:10 이미지, 세로 스택) */
export function CarListCard({ product, saved, onSavedChange }: CarCardProps) {
    return (
        <Link
            to={`/product/${product.id}`}
            className="block bg-surface border border-line rounded-2xl overflow-hidden"
        >
            <div className="relative aspect-[16/10] bg-surface-2">
                {product.images?.[0] ? (
                    <Image src={product.images[0]} alt={product.name} className="w-full h-full object-cover" size="medium" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[11px] font-bold tracking-[0.1em] text-muted-3">
                        ЗУРАГ
                    </div>
                )}
                <button
                    onClick={e => {
                        e.preventDefault();
                        toggleSaved(product.id);
                        onSavedChange?.();
                    }}
                    aria-label="Хадгалах"
                    className="absolute top-2.5 right-2.5 w-11 h-11 border-0 rounded-full bg-black/55 flex items-center justify-center text-white"
                >
                    <Heart size={17} fill={saved ? '#FF1A1A' : 'none'} className={saved ? 'text-primary' : ''} />
                </button>
                {product.status === 'sold' && (
                    <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                        <span className="text-white text-xs font-extrabold px-2.5 py-1 bg-black/50 rounded-lg">Зарагдсан</span>
                    </div>
                )}
            </div>
            <div className="px-4 pt-3.5 pb-4">
                <div className="text-[15px] font-bold tracking-tight">{product.name}</div>
                <div className="mt-[5px] text-[12.5px] font-medium text-muted">{metaOf(product)}</div>
                <div className="mt-2.5 flex items-baseline gap-2">
                    <span className="text-[17px] font-extrabold text-primary">{product.price}</span>
                </div>
                {product.priceKRW ? (
                    <div className="mt-1 text-xs font-semibold text-muted">
                        Солонгост <span className="font-extrabold text-ink">₩{product.priceKRW.toLocaleString()}</span>
                    </div>
                ) : null}
                {product.tags?.length ? (
                    <div className="mt-2.5 flex gap-[5px] flex-wrap">
                        {product.tags.map((tag, i) => (
                            <span key={i} className="text-[11px] font-bold text-ink-3 bg-line rounded-[5px] px-[7px] py-1 whitespace-nowrap">
                                {tag}
                            </span>
                        ))}
                    </div>
                ) : null}
            </div>
        </Link>
    );
}

/**
 * PC 디자인용 카드 (4:3 이미지, 점선 구분선 아래 "Монголд очих үнэ").
 * 홈 4열 그리드와 검색 3열 그리드에서 사용.
 */
export function CarDesktopCard({ product, saved, onSavedChange }: CarCardProps) {
    return (
        <Link
            to={`/product/${product.id}`}
            className="block bg-surface border border-line rounded-2xl overflow-hidden hover:border-line-2 transition-colors"
        >
            <div className="relative aspect-[4/3] bg-surface-2">
                {product.images?.[0] ? (
                    <Image src={product.images[0]} alt={product.name} className="w-full h-full object-cover" size="medium" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[11px] font-bold tracking-[0.1em] text-muted-3">
                        ЗУРАГ
                    </div>
                )}
                <button
                    onClick={e => {
                        e.preventDefault();
                        toggleSaved(product.id);
                        onSavedChange?.();
                    }}
                    aria-label="Хадгалах"
                    className="absolute top-2.5 right-2.5 w-8 h-8 border-0 rounded-full bg-black/55 flex items-center justify-center text-muted"
                >
                    <Heart size={15} fill={saved ? '#FF1A1A' : 'none'} className={saved ? 'text-primary' : ''} />
                </button>
                {product.status === 'sold' && (
                    <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                        <span className="text-white text-xs font-extrabold px-2.5 py-1 bg-black/50 rounded-lg">Зарагдсан</span>
                    </div>
                )}
            </div>
            <div className="px-4 pt-3.5 pb-4">
                <div className="text-[14.5px] font-extrabold tracking-tight truncate">{product.name}</div>
                <div className="mt-1 text-[12.5px] font-medium text-muted truncate">{metaOf(product)}</div>
                <div className="my-3 border-t border-dashed border-line" />
                <div className="text-[11.5px] font-semibold text-muted-2">Монголд очих үнэ</div>
                <div className="mt-1 text-[19px] font-extrabold tracking-tight text-primary">{product.price}</div>
                {product.priceKRW ? (
                    <div className="mt-[3px] text-xs font-medium text-muted-2">
                        Солонгос дахь үнэ ₩{product.priceKRW.toLocaleString()}
                    </div>
                ) : null}
            </div>
        </Link>
    );
}

/** 저장 목록용 가로 카드 */
export function CarRowCard({ product, saved, onSavedChange }: CarCardProps) {
    return (
        <Link
            to={`/product/${product.id}`}
            className="flex gap-3.5 bg-surface border border-line rounded-2xl p-3"
        >
            <div className="w-[118px] h-[88px] flex-none rounded-[11px] overflow-hidden bg-surface-2 flex items-center justify-center">
                {product.images?.[0] ? (
                    <Image src={product.images[0]} alt={product.name} className="w-full h-full object-cover" size="thumbnail" />
                ) : (
                    <span className="text-[10px] font-bold tracking-[0.1em] text-muted-3">ЗУРАГ</span>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-bold truncate">{product.name}</div>
                <div className="mt-1 text-xs font-medium text-muted truncate">{metaOf(product)}</div>
                <div className="mt-2 text-[15px] font-extrabold text-primary">{product.price}</div>
                {product.priceKRW ? (
                    <div className="mt-0.5 text-[11.5px] font-semibold text-muted">
                        Солонгост ₩{product.priceKRW.toLocaleString()}
                    </div>
                ) : null}
            </div>
            <button
                onClick={e => {
                    e.preventDefault();
                    toggleSaved(product.id);
                    onSavedChange?.();
                }}
                aria-label="Хадгалах"
                className="w-11 h-11 flex-none border-0 rounded-full bg-surface-2 flex items-center justify-center text-danger self-center"
            >
                <Heart size={17} fill={saved ? 'currentColor' : 'none'} />
            </button>
        </Link>
    );
}
