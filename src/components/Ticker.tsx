const ITEMS = [
    '3,796 машин бэлэн',
    'Бүх машин ослын түүх шалгасан',
    '1 жилийн үнэгүй баталгаа',
    'Гааль, тээвэр багцад',
    'Улаанбаатарт хүргэлт',
    'Ханш өдөр бүр шинэчлэгдэнэ',
];

/** 데스크탑 헤더 아래 검정 마퀴 띠 (PC 디자인 전용) */
export default function Ticker() {
    return (
        <div className="hidden lg:block bg-black overflow-hidden">
            <div className="flex w-[200%] animate-marquee">
                {[...ITEMS, ...ITEMS].map((label, i) => (
                    <div
                        key={i}
                        className="flex-1 flex items-center justify-center gap-2 h-[42px] text-white text-[12.5px] font-bold whitespace-nowrap"
                    >
                        <span className="text-accent-soft">✓</span>
                        {label}
                    </div>
                ))}
            </div>
        </div>
    );
}
