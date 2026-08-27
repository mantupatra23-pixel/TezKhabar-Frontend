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
        brand: {
          navy: "#152935",
          blue: "#698EA2",
          peach: "#E4A576",
          sage: "#CCD5D2",
          cream: "#FDE5D6",
          creamLight: "#FFF7F2",
          surfaceDark: "#1C3545",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        hindi: ["var(--font-noto-hindi)", "sans-serif"],
      },
      maxWidth: {
        article: "740px",
      },
    },
  },
  plugins: [],
};

export default config;
