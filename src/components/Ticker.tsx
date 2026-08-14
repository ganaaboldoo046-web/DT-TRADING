import { useEffect, useState } from 'react';

// 관리자에서 아직 설정하지 않았을 때의 기본 문구
const DEFAULT_ITEMS = [
    'Бүх машин ослын түүх шалгасан',
    '1 жилийн үнэгүй баталгаа',
    'Гааль, тээвэр багцад',
    'Улаанбаатарт хүргэлт',
    'Ханш өдөр бүр шинэчлэгдэнэ',
];

/** 데스크탑 헤더 아래 검정 마퀴 띠 (PC 디자인 전용). 문구는 관리자 페이지에서 수정 가능. */
export default function Ticker() {
    const [items, setItems] = useState<string[]>(DEFAULT_ITEMS);

    useEffect(() => {
        fetch('/api/ticker')
            .then(res => res.json())
            .then((data: { items?: string[] }) => {
                if (Array.isArray(data.items) && data.items.length > 0) setItems(data.items);
            })
            .catch(() => { /* 실패 시 기본 문구 유지 */ });
    }, []);

    return (
        <div className="hidden lg:block bg-black overflow-hidden">
            <div className="flex w-[200%] animate-marquee">
                {[...items, ...items].map((label, i) => (
                    <div
                        key={i}
                        className="flex-1 flex items-center justify-center gap-2 h-[42px] text-white text-[12.5px] font-bold whitespace-nowrap px-6"
                    >
                        <span className="text-accent-soft">✓</span>
                        {label}
                    </div>
                ))}
            </div>
        </div>
    );
}
