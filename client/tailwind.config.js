/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        '100': '26.76rem',
        '200': '69.5rem',
        '300':  '66rem'
      },
      height: {
        '100': '45.4rem',
      }
    },
  },
  plugins: [],
}

