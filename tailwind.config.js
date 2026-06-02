/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Consolas", "monospace"],
      },
      colors: {
        ink: "#07090d",
        panel: "#10151d",
        line: "rgba(190, 226, 255, 0.14)",
        cyan: "#48d8ff",
        mint: "#79f2bc",
        amber: "#ffce73",
        rose: "#ff6f91",
      },
      boxShadow: {
        glow: "0 0 60px rgba(72, 216, 255, 0.18)",
        card: "0 24px 70px rgba(0, 0, 0, 0.38)",
      },
    },
  },
  plugins: [],
};
