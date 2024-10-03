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
      },
    },
  },
}
