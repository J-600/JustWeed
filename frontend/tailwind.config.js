/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

module.exports = {
  content: ["./src/**/*.{html,js,jsx}", "./public/index.html"],
  
  // important: true,
  
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#9333ea",
          "secondary": "#3b82f6",    
          "accent": "#818cf8",        
          "neutral": "#1E2633",       
          "base-100": "#0A1128",      
          "base-200": "#1E2633",     
          "base-300": "#2A3444",
          "base-400": "#2C3E50",  
          "info": "#3b82f6",
          "success": "#22c55e",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
    ],
  },
  
  plugins: [daisyui],
  
  theme: {
    extend: {
      colors: {
        'base-400': '#2C3E50',
        'card-base-100': '#2A3447',
        'emerald': {
          '50': '#ecfdf5',
          '100': '#d1fae5',
          '200': '#a7f3d0',
          '300': '#6ee7b7',
          '400': '#34d399',
          '500': '#10b981',
          '600': '#059669',
          '700': '#047857',
          '800': '#065f46',
          '900': '#064e3b',
        },
        'lime': {
          '50': '#f7fee7',
          '100': '#ecfccb',
          '200': '#d9f99d',
          '300': '#bef264',
          '400': '#a3e635',
          '500': '#84cc16',
          '600': '#65a30d',
          '700': '#4d7c0f',
          '800': '#3f6212',
          '900': '#365314',
        }
      },
    },
  },
}