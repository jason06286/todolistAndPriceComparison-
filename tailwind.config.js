const colors = require('tailwindcss/colors')
const flagger = require('tailwind-flagger')

module.exports = {
  mode: "jit",
  purge: [
    "./*.{html,js}",
    "./**/*.{html,js}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        lime: colors.lime
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    flagger
  ],
}