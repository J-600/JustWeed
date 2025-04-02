/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

module.exports = {
  content: ["./src/**/*.{html,js,jsx}", "./public/index.html"],
  
  // Aggiunto per forzare alcuni stili quando necessario
  important: true,
  
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
      },
    },
  },
}