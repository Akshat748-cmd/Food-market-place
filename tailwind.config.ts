import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FFF9EF',
          50: '#FFFCF7',
          100: '#FFF9EF',
          200: '#FBF2E0',
          300: '#F6E7CB',
        },
        warmWhite: '#FFFFFF',
        olive: {
          DEFAULT: '#263D2D',
          dark: '#1C2E22',
          light: '#37523F',
        },
        forest: {
          DEFAULT: '#315B42',
          dark: '#244532',
          light: '#3F7455',
          soft: '#EAF3ED',
        },
        golden: {
          DEFAULT: '#F8C45C',
          light: '#FDE9BE',
          soft: '#FEF6E4',
          dark: '#DB9E27',
          border: 'rgba(248, 196, 92, 0.45)',
        },
        brown: {
          DEFAULT: '#66523B',
          dark: '#2C1E14',
          subtle: '#877057',
          muted: '#A48E75',
          light: '#ECE2D3',
        },
        beige: {
          DEFAULT: '#F1E8D8',
          light: '#F8F3EA',
          border: '#E4D7C0',
        },
        semantic: {
          saving: '#315B42',
          'saving-bg': '#EAF3ED',
          caution: '#D97706',
          'caution-bg': '#FEF3C7',
          danger: '#C2410C',
          'danger-bg': '#FEE2E2',
        },
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
      borderRadius: {
        'card-sm': '12px',
        card: '20px',
        'card-lg': '28px',
      },
      boxShadow: {
        'warm-xs': '0 1px 3px 0 rgba(102, 82, 59, 0.05)',
        'warm-sm': '0 2px 8px -1px rgba(102, 82, 59, 0.07)',
        warm: '0 4px 20px -2px rgba(102, 82, 59, 0.08)',
        'warm-md': '0 8px 24px -3px rgba(102, 82, 59, 0.10)',
        'warm-lg': '0 14px 34px -4px rgba(102, 82, 59, 0.12)',
        'warm-xl': '0 22px 50px -8px rgba(102, 82, 59, 0.16)',
      },
      transitionTimingFunction: {
        'warm-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
