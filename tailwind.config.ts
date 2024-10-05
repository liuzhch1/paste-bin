import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        green: {
          50: '#FFFFFF',
          100: '#F5F7F9',
          200: '#DCE2E9',
          300: '#C3CED9',
          400: '#AABAC9',
          500: '#91A6B9',
          600: '#7891A9',
          700: '#617D98',
          800: '#51697F',
          900: '#415466',
          950: '#364655',
        },
        violet: {
          50: '#ecfeff',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f33',
        },
      },
    },
  },
}
