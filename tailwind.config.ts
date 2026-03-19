import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        disco: {
          black: "#0a0a0a",
          blackSoft: "#1a1a1a",
          gold: "#D4AF37",
          goldLight: "#F4E4BA",
          silver: "#C0C0C0",
          silverDark: "#A8A8A8",
          cream: "#F4E4BA",
          deep: "#D4AF37",
          beige: "#1a1a1a",
          soft: "#D4AF37",
          gray: "#C0C0C0",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
