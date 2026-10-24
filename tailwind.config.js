/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Lora', 'serif'],
        display: ['Playfair Display', 'serif'],
      },
      colors: {
        parchment: { DEFAULT: '#F9F6F0', dark: '#E8E4D9' },
        ink: { DEFAULT: '#2B2927', light: '#4A4744' },
        crimson: { DEFAULT: '#8A2B32', light: '#A33B43' }
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.4s ease-out forwards',
      }
    },
  },
  plugins: [],
}