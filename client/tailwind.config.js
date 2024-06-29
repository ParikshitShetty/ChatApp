/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'custom-pitch-dark':'#020000',
        'custom-grey':'#020000'
      }
    },
  },
  plugins: [],
}

