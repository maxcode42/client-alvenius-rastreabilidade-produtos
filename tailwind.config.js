/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./types/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    //"./app/**/*.{js,ts,jsx,tsx,mdx}", // caso use o App Router
  ],
  // safelist: [
  //   "bg-amber-400",
  //   "text-amber-100",
  //   "bg-teal-400",
  //   "text-teal-100",
  //   "bg-orange-400",
  //   "text-orange-100",
  //   "bg-green-500",
  //   "text-green-100",
  //   "bg-lime-400",
  //   "text-lime-100",
  //   "bg-red-400",
  //   "text-red-100",
  //   "bg-sky-500",
  //   "text-sky-100",
  //   "bg-stone-200",
  //   "text-stone-950",
  // ],
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
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleInCenter: {
          "0%": { opacity: "0", transform: "scale(0.7)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        scan: "scan 2s linear infinite",
        fadeInUp: "fadeInUp 0.5s ease-out forwards",
        fadeInDown: "fadeInDown 0.5s ease-out forwards",
        scaleInCenter:
          "scaleInCenter 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};
