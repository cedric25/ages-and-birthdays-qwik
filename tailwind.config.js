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
      },
      padding: {
        'top-menu': 'var(--top-menu-height)',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/colors/themes')['[data-theme=light]'],
          // primary: '#a991f7',
          // secondary: '#f6d860',
          // accent: '#37cdbe',
          // neutral: '#3d4451',
          'base-100': '#fafafa',
        },
      },
    ],
  },
}
