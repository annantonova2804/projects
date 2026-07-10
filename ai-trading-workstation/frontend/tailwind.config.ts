import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        term: {
          bg: "#0a0d10",
          panel: "#10151a",
          border: "#1f2933",
          up: "#22c55e",
          down: "#ef4444",
          amber: "#f59e0b",
          text: "#d8dee9",
          muted: "#6b7684",
          accent: "#38bdf8",
        },
      },
      keyframes: {
        "flash-up": {
          "0%": { backgroundColor: "rgba(34,197,94,0.35)" },
          "100%": { backgroundColor: "transparent" },
        },
        "flash-down": {
          "0%": { backgroundColor: "rgba(239,68,68,0.35)" },
          "100%": { backgroundColor: "transparent" },
        },
      },
      animation: {
        "flash-up": "flash-up 0.6s ease-out",
        "flash-down": "flash-down 0.6s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
