/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './styles/**/*.css',
  ],
  theme: {
    extend: {
      colors: {
        base: 'rgb(var(--c-base)     / <alpha-value>)',
        surface: 'rgb(var(--c-surface)  / <alpha-value>)',
        elevated: 'rgb(var(--c-elevated) / <alpha-value>)',
        border: 'rgb(var(--c-border)   / <alpha-value>)',
        primary: 'rgb(var(--c-primary)  / <alpha-value>)',
        secondary: 'rgb(var(--c-secondary)/ <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--c-accent)       / <alpha-value>)',
          dim: 'rgb(var(--c-accent)       / 0.12)',
        },
        success: 'rgb(var(--c-success) / <alpha-value>)',
        warning: 'rgb(var(--c-warning) / <alpha-value>)',
        danger: {
          DEFAULT: 'rgb(var(--c-danger) / <alpha-value>)',
          dim: 'rgb(var(--c-danger) / 0.12)',
        },
        'data-cyan': 'rgb(var(--c-data-cyan) / <alpha-value>)',
        'data-orange': 'rgb(var(--c-data-orange) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Google Sans Flex', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      borderRadius: {
        // nullxx design system, v1: card 22px, control 13px, badge 20px,
        // progress 6px. `xl`/`2xl` both collapse onto the single control
        // radius, since the app doesn't otherwise distinguish "small" vs
        // "medium" controls (inputs vs buttons/tiles) — everything
        // interactive uses one of the two. Pills (chips, icon-only
        // buttons) keep Tailwind's default `rounded-full`.
        xl: '13px',
        '2xl': '13px',
        '3xl': '22px',
        badge: '20px',
        progress: '6px',
      },
      boxShadow: {
        card: '2px 2px 5px rgb(var(--c-shadow-dark)), -2px -2px 5px rgb(var(--c-shadow-light))',
        'card-inset':
          'inset 1px 1px 2px rgb(var(--c-shadow-dark)), inset -1px -1px 2px rgb(var(--c-shadow-light))',
        'card-hover':
          '0 4px 16px rgb(var(--c-shadow-dark) / 0.6), 0 0 0 1px rgb(var(--c-accent) / 0.3)',
        control:
          '2px 2px 4px rgb(var(--c-shadow-dark)), -2px -2px 4px rgb(var(--c-shadow-light))',
        glow: '0 0 20px rgb(var(--c-accent) / 0.25)',
      },
      keyframes: {
        'slide-in': {
          from: { opacity: '0', transform: 'translateY(-6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
        'progress-indeterminate': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(350%)' },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.15s ease-out',
        'fade-in': 'fade-in  0.2s  ease-out',
        'progress-indeterminate': 'progress-indeterminate 1.1s ease-in-out infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
