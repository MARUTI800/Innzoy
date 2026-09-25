/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FDFCFB',
          100: '#FAF8F5',
          200: '#F4EFEA',
          300: '#EDE5DC',
          400: '#E4D8CB',
        },
        stone: {
          50: '#F7F6F4',
          100: '#EFECE7',
          200: '#E5E0D7',
          300: '#D6CFC3',
          400: '#BEB4A4',
          500: '#A39887',
          600: '#857A69',
          700: '#645B4E',
          800: '#463F36',
          900: '#2C2721',
        },
        charcoal: {
          50: '#757371',
          100: '#545250',
          200: '#3D3B39',
          300: '#2C2A29',
          400: '#22201F',
          500: '#1A1918',
          600: '#151413',
          700: '#100F0F',
          800: '#0C0C0B',
          900: '#080807',
        },
        bronze: {
          DEFAULT: '#B89F7D',
          light: '#CEBBA0',
          dark: '#937854',
          subtle: '#EDE2D4',
        }
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'Space Mono', 'monospace'],
      },
      letterSpacing: {
        'widest-editorial': '0.25em',
        'architectural': '0.35em',
      },
      borderRadius: {
        'none': '0px',
        'sm': '2px',
        DEFAULT: '2px',
        'md': '4px',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'luxury-slow': 'cubic-bezier(0.25, 1, 0.5, 1)',
      }
    },
  },
  plugins: [],
};
