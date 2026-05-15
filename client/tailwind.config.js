/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        serif: ["'Source Serif 4'", "Georgia", "Times New Roman", "serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#233DFF",
          hover: "#1A2ECC",
          light: "rgba(35,61,255,0.09)",
          glow: "rgba(35,61,255,0.22)",
        },
      },
    },
  },
  plugins: [],
}

