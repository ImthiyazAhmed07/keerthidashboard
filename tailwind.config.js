/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sunflower: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        warm: {
          50: '#faf9f6',
          100: '#f5f2eb',
          200: '#e8e2d5',
          300: '#d4cbba',
          400: '#b5a791',
          500: '#96846c',
          600: '#7a6a54',
          700: '#615342',
          800: '#4e4336',
          900: '#2b251e',
          950: '#191510',
        },
        darkbg: {
          surface: '#181614',
          card: '#221f1b',
          cardHover: '#2a2622',
          border: '#38332c',
          muted: '#8a8175',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        handwriting: ['Caveat', 'Patrick Hand', 'cursive'],
      },
      boxShadow: {
        'warm-sm': '0 1px 3px rgba(217, 119, 6, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'warm-md': '0 4px 14px -1px rgba(217, 119, 6, 0.12), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'warm-lg': '0 10px 25px -3px rgba(217, 119, 6, 0.15), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
        'warm-glow': '0 0 20px rgba(245, 158, 11, 0.25)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-gentle': 'pulseGentle 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-6px) rotate(2deg)' },
        },
        pulseGentle: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.03)', opacity: '0.9' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
