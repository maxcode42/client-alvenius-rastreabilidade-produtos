/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    //"./app/**/*.{js,ts,jsx,tsx,mdx}", // caso use o App Router
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        layout: "19vw 1fr 19vw",
        login: "50vw 50vw",
      },
      gridTemplateRows: {
        layout: "7vh 1fr 17vh",
      },
      keyframes: {
        scan: {
          "0%": { top: "0%" },
          "100%": { top: "100%" },
        },
      },
      animation: {
        scan: "scan 2s linear infinite",
      },
    },
  },
  plugins: [],
};
