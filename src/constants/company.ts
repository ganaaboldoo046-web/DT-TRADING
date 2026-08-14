// DT TRADING 회사/연락처 상수 (Claude Design 시안 기준)
export const COMPANY = {
    name: 'DT TRADING',
    tagline: 'AUTO EXPORT',
    logoShort: 'DT',
    copyright: '© 2026 DT Trading. All rights reserved.',
    address: 'Инчон хот, Ённсү дүүрэг, Нынхөдэ-ро 192',
    // 개인정보처리방침/이용약관 및 Google OAuth 동의 화면에 노출되는 공식 연락처.
    // 실제 사용하는 주소로 채워야 Google 심사에서 연락처 검증을 통과한다. 비우면 화면에 표시되지 않는다.
    email: '',
    // 메뉴 연락처 카드
    phoneMain: '010 5727 9927',
    phoneSub: '9900 1979',
    // 주문(Захиалга) 연락 채널
    contactChannels: [
        {
            key: 'messenger',
            icon: '✆',
            title: 'Messenger',
            sub: 'Facebook Messenger-ээр бичих',
            href: 'https://m.me/a.t.g.ld.r.719276',
            bg: 'linear-gradient(135deg, #7B5BFF 0%, #C13BFF 100%)',
        },
        {
            key: 'facebook',
            icon: 'f',
            title: 'Facebook',
            sub: 'Facebook хуудас руу очих',
            href: 'https://www.facebook.com/a.t.g.ld.r.719276',
            bg: '#1877F2',
        },
        {
            key: 'phone1',
            icon: '☎',
            title: '010-7755-0118',
            sub: 'Утсаар холбогдох',
            href: 'tel:01077550118',
            bg: '#22C55E',
        },
        {
            key: 'phone2',
            icon: '☎',
            title: '010-8460-5703',
            sub: 'Утсаар холбогдох',
            href: 'tel:01084605703',
            bg: '#22C55E',
        },
    ],
} as const;

export { FUEL_LABELS, fuelLabel } from './fuel';
