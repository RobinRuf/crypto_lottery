/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        brand: "'Great Vibes', cursive",
        standard: "'Rajdhani', sans-serif",
      }
    },
  },
  plugins: [],
}