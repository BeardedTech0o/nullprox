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
          DEFAULT: 'rgb(var(--c-border) / calc(var(--a-border) * <alpha-value>))',
          strong: 'rgb(var(--c-border-strong) / calc(var(--a-border-strong) * <alpha-value>))',
        },
        primary: 'rgb(var(--c-primary)  / <alpha-value>)',
        secondary: 'rgb(var(--c-secondary) / calc(var(--a-secondary) * <alpha-value>))',
        faint: 'rgb(var(--c-faint) / calc(var(--a-faint) * <alpha-value>))',
        inverse: 'rgb(var(--c-inverse) / <alpha-value>)',
        'on-inverse': 'rgb(var(--c-on-inverse) / <alpha-value>)',
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
        // Warm ember glass: pills for controls, 26px cards, 32px hero surfaces.
        xl: '16px',
        '2xl': '999px',
        '3xl': '26px',
        hero: '32px',
        badge: '999px',
        progress: '999px',
      },
      // Soft warm shadows in light, a 1px inner highlight in dark (see tokens).
      boxShadow: {
        card: 'var(--shadow-card)',
        'card-inset': 'none',
        'card-hover': 'var(--shadow-card), 0 0 0 1px rgb(var(--c-primary) / 0.12)',
        control: 'none',
        glow: 'var(--hero-glow)',
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
        'slide-in': 'slide-in 0.2s cubic-bezier(.2,.7,.2,1)',
        'fade-in': 'fade-in 350ms cubic-bezier(.2,.7,.2,1)',
        'progress-indeterminate': 'progress-indeterminate 1.1s ease-in-out infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
