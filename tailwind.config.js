/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        'green-hcs': '#1C4645',
        'green-hcs-2': '#D7E6E0',
        'green-hcs-3': '#43826E',
      }
    },
  },
  plugins: [],
}

