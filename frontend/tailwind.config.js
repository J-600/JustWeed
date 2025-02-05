/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'


module.exports = {
  content: ["./src/**/*.{html,js,jsx}", "./public/index.html"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
}

