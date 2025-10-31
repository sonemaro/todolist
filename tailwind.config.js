/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pastel: {
          mint: '#A7F3D0',
          'mint-dark': '#10B981',
          lavender: '#DDD6FE',
          'lavender-dark': '#8B5CF6',
          blue: '#BFDBFE',
          'blue-dark': '#3B82F6',
          pink: '#FBCFE8',
          'pink-dark': '#EC4899',
          yellow: '#FEF3C7',
          'yellow-dark': '#F59E0B',
          orange: '#FED7AA',
          'orange-dark': '#F97316',
          teal: '#A7F3D0',
          'teal-dark': '#14B8A6',
          purple: '#E9D5FF',
          'purple-dark': '#A855F7',
        },
        dark: {
          bg: '#0F172A',
          card: '#1E293B',
          border: '#334155',
        }
      },
      fontFamily: {
        'vazir': ['Vazir', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'bounce-in': 'bounceIn 0.6s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'confetti': 'confetti 1s ease-out',
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        confetti: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(360deg)', opacity: '0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
};