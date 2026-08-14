/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // DT TRADING 브랜드 컬러
        "primary": "#FF1A1A",
        "primary-dark": "#B70000",
        // 디자인 토큰 (index.css의 CSS 변수 참조, 다크/라이트 자동 전환)
        "app": "var(--bg)",
        "surface": {
          DEFAULT: "var(--surface)",
          2: "var(--surface-2)",
          3: "var(--surface-3)",
        },
        "line": {
          DEFAULT: "var(--line)",
          2: "var(--line-2)",
        },
        "ink": {
          DEFAULT: "var(--text)",
          2: "var(--text-2)",
          3: "var(--text-3)",
          block: "var(--ink-block)",
        },
        "muted": {
          DEFAULT: "var(--muted)",
          2: "var(--muted-2)",
          3: "var(--muted-3)",
          4: "var(--muted-4)",
        },
        "tint": "var(--tint)",
        "danger": "var(--danger)",
        "accent-soft": "var(--accent-soft)",
        // 관리자 페이지 호환용 (기존 코드)
        "background-light": "#f6f6f8",
        "background-dark": "#101622",
      },
      fontFamily: {
        "display": ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        "sans": ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [],
}
