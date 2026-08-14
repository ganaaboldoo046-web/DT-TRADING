// 연료 표기 통일 (DB에 영문으로 저장된 경우 몽골어로)
export const FUEL_LABELS: Record<string, string> = {
    Petrol: 'Бензин',
    Diesel: 'Дизель',
    Hybrid: 'Хайбрид',
    Electric: 'Цахилгаан',
    Gas: 'Газ',
};

export const fuelLabel = (fuel: string) => FUEL_LABELS[fuel] || fuel;
