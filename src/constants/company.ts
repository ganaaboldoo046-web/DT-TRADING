// DT TRADING 회사/연락처 상수 (Claude Design 시안 기준)
export const COMPANY = {
    name: 'DT TRADING',
    tagline: 'AUTO EXPORT',
    logoShort: 'DT',
    copyright: '© 2026 DT Trading. All rights reserved.',
    address: 'Кёнгидо, Сувон хот, Пёндон 22-17 (경기도 수원시 평동 22-17)',
    // 개인정보처리방침/이용약관 및 Google OAuth 동의 화면에 노출되는 공식 연락처
    email: 'sonorsinister@gmail.com',
    // 메뉴 연락처 카드
    phoneMain: '010 7755 0118',
    phoneSub: '010 8460 5703',
    // 주문(Захиалга) 연락 채널
    contactChannels: [
        {
            key: 'messenger',
            icon: '✆',
            title: 'Messenger',
            sub: 'Facebook Messenger-ээр бичих',
            // 모바일: Messenger 앱으로 바로 연결
            href: 'https://m.me/a.t.g.ld.r.719276',
            // PC: m.me가 빈 메신저 홈으로 떨어지는 경우가 있어 메시지 스레드로 직접 연결
            hrefDesktop: 'https://www.facebook.com/messages/t/a.t.g.ld.r.719276',
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
