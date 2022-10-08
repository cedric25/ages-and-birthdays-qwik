const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts,tsx,mdx}'],
  theme: {
    extend: {
      backgroundColor: {
        primary: colors.sky['400'],
      },
      colors: {
        primary: colors.sky['400'],
      },
      height: {
        'top-menu': 'var(--top-menu-height)',
        'top-filters': 'var(--top-filters-height)',
      },
      padding: {
        'top-menu': 'var(--top-menu-height)',
      },
    },
  },
  plugins: [],
}
