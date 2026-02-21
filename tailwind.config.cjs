/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        lavender: {
          50: '#F8F4FF',
          100: '#EFE3FF',
          200: '#DECAFF',
          300: '#C9A9FF',
          400: '#B485FA',
          500: '#9D63F2',
          600: '#8446D8',
          700: '#6A35B0',
          800: '#4F2785',
          900: '#391D5F'
        }
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(132, 70, 216, 0.35)'
      },
      animation: {
        fadeInUp: 'fadeInUp 0.35s ease-out'
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0px)' }
        }
      }
    }
  },
  plugins: []
};
