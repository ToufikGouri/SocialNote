/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        myPurple: "#8481FF",
        myGreen: "#4CD77B",
        myPink: "#FFDEDE",
        myBlue: "#84C3DE"
      }
    },
  },
  plugins: [],
}

