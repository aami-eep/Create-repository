import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "#0B0C0F",
          soft: "#111318",
          light: "#FBFAF8",
          lightSoft: "#F3F1EC",
        },
        ink: {
          DEFAULT: "#0B0C0F",
          soft: "#4A4D57",
          inverted: "#F5F4F1",
        },
        line: {
          DEFAULT: "#23262E",
          light: "#E7E4DC",
        },
        brand: {
          50: "#F1F0FF",
          100: "#E3E1FF",
          300: "#B3ACFF",
          400: "#8E82FF",
          500: "#6C5CE8",
          600: "#5641D6",
          700: "#4531AE",
        },
        signal: {
          green: "#3DD68C",
          amber: "#F0B429",
          red: "#F0554A",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -12px rgba(0,0,0,0.12)",
        cardDark: "0 1px 0 rgba(255,255,255,0.03), 0 12px 32px -16px rgba(0,0,0,0.6)",
      },
      keyframes: {
        pulseSlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        pulseSlow: "pulseSlow 2.4s ease-in-out infinite",
        fadeUp: "fadeUp 0.5s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
