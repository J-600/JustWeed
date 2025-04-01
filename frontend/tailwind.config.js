/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'


module.exports = {
  content: ["./src/**/*.{html,js,jsx}", "./public/index.html"],
  daisyui: {
    themes: [
      {
        mytheme: {

          "primary": "#7480FF",
          "secondary": "#FF54DA",
          "base-100": "#1D232A",
        },
      },
    ],
  },
  plugins: [daisyui],
}

