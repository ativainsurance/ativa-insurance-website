import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        personal: {
          DEFAULT: "#1B3A6B",
          dark:    "#0F2347",
          mid:     "#2451A0",
          light:   "#EEF2FF",
          border:  "#C7D7FD",
          accent:  "#4A90E2",
        },
        commercial: {
          DEFAULT:    "#1A1A1A",
          dark:       "#0A0A0A",
          mid:        "#2C2C2C",
          gold:       "#F5C400",
          "gold-dark":"#D4A800",
          "gold-light":"#FFF9D6",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 12px rgba(27,58,107,0.08)",
        "card-hover": "0 10px 40px rgba(27,58,107,0.15)",
        "card-dark": "0 2px 16px rgba(0,0,0,0.4)",
        "card-dark-hover": "0 12px 48px rgba(0,0,0,0.6)",
        modal: "0 24px 80px rgba(0,0,0,0.24)",
      },
    },
  },
  plugins: [],
};

export default config;
