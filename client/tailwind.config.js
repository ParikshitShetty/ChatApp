/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
    "!./node_modules/**",
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

