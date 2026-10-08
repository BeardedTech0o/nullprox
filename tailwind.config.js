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
        border: {
          DEFAULT: 'rgb(var(--c-border)   / <alpha-value>)',
          strong: 'rgb(var(--c-border-strong) / <alpha-value>)',
        },
        primary: 'rgb(var(--c-primary)  / <alpha-value>)',
        secondary: 'rgb(var(--c-secondary)/ <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--c-accent)       / <alpha-value>)',
          dim: 'rgb(var(--c-accent)       / 0.08)',
        },
        'on-accent': 'rgb(var(--c-on-accent) / <alpha-value>)',
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
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },
      borderRadius: {
        // Nullobj design system: pill-shaped controls (buttons, tiles, chips),
        // 12px inputs, 18px cards. `2xl` is the pill used by every button.
        xl: '12px',
        '2xl': '999px',
        '3xl': '18px',
        badge: '999px',
        progress: '999px',
      },
      // Nullobj: no shadows on cards. Keys are kept so existing class names
      // resolve; interactive cards get a foreground ring on hover instead.
      boxShadow: {
        card: 'none',
        'card-inset': 'none',
        'card-hover': '0 0 0 1px rgb(var(--c-primary))',
        control: 'none',
        glow: 'none',
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
