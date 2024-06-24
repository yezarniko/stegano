import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        primary: {
          sky: colors.sky[400],
          dark: colors.slate[900],
          DEFAULT: colors.white
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif']
      },
      keyframes: {
        translateRight_en: {
          '0%': { transform: 'translateX(0) scale(0.4)' },
          '100%': { transform: 'translateX(100%) scale(0.2)' }
        },
        translateRight_de: {
          '0%': { transform: 'translateX(0) scale(0.2)' },
          '100%': { transform: 'translateX(100%) scale(0.4)' }
        }
      },
      animation: {
        translateRight_en: 'translateRight_en 3s ease-in-out infinite',
        translateRight_de: 'translateRight_de 3s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
