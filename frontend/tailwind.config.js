/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff5a35',
        secondary: '#f43f5e',
        'brand-orange': '#ff5a35',
        'brand-secondary': '#ff2d55',
        dark: {
          bg: '#030014',
          card: '#0c0a1f',
          border: '#1e1b4b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
