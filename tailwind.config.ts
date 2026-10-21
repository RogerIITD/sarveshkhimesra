import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0b0d12",
        panel: "#12151c",
        "panel-hi": "#181c25",
        ink: "#e8eaf0",
        dim: "#9aa1b2",
        accent: "rgb(var(--accent) / <alpha-value>)",
        line: "rgb(255 255 255 / 0.08)",
        "line-strong": "rgb(255 255 255 / 0.18)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
        hindi: ["var(--font-hindi)", "serif"],
      },
      animation: {
        "spin-slow": "spin 6s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
