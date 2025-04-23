/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f8f3f3', 
        accent: '#ffffff',  
        text: '#ffffff',
        dark: '#000000'
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'],
      },
      animation: {
        'blur-zap': 'blurryZap 1s ease-in-out',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}