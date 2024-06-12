/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        myPurple: "#8481FF",
        myGreen: "#4CD77B",
        myPink: "#FFDEDE",
        myBlue: "#84C3DE",
        myGrey: "#D9D9D9",

        urgentRed: "#FB6868",
        urgentOrange: "#FF985C",
        urgentGreen: "#46BEA6",
      }
    },
  },
  plugins: [],
}

