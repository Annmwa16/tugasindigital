import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1A2540',
          light: '#243558',
          dark: '#111829',
          950: '#0D1220',
        },
        gold: {
          DEFAULT: '#F4B41A',
          light: '#F8CC5A',
          dark: '#D69A0D',
          50: '#FEF9EC',
        },
        platinum: {
          DEFAULT: '#E5E4E2',
          dark: '#CFCDC9',
          light: '#F2F2F1',
        },
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(244, 180, 26, 0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(244, 180, 26, 0)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'luxury': '0 4px 32px rgba(26, 37, 64, 0.3), 0 1px 4px rgba(244, 180, 26, 0.1)',
        'gold': '0 4px 24px rgba(244, 180, 26, 0.3)',
      },
    },
  },
  plugins: [],
}

export default config
