/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pink: {
          DEFAULT: '#f25a97',
          50:  '#fff0f7',
          100: '#ffd6eb',
          200: '#ffadd6',
          300: '#ff75b5',
          400: '#f25a97',
          500: '#e03880',
          600: '#c01f67',
          700: '#9e1553',
          800: '#7e1242',
          900: '#5e0d32',
        },
      },
      fontFamily: {
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-pink': 'pulsePink 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulsePink: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(242,90,151,0.4)' },
          '50%': { boxShadow: '0 0 0 15px rgba(242,90,151,0)' },
        },
      },
    },
  },
  plugins: [],
}
