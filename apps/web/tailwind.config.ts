import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#FFF8F0",
          100: "#FFE8CC",
          400: "#F97316",
          500: "#EA6C0A",
          900: "#7C2D00",
        },
        neutral: {
          0:   "#FFFFFF",
          50:  "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          400: "#9CA3AF",
          600: "#4B5563",
          800: "#1F2937",
          900: "#111827",
        },
        accent: {
          green:  "#10B981",
          purple: "#8B5CF6",
          red:    "#EF4444",
        },
      },
      fontFamily: {
        sans:    ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-sora)", "var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        sm: "6px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },
      boxShadow: {
        card: "0 2px 12px rgba(249,115,22,0.08)",
        md:   "0 4px 16px rgba(0,0,0,0.10)",
      },
      animation: {
        "fade-in":    "fadeIn 0.3s ease-out",
        "slide-up":   "slideUp 0.4s cubic-bezier(0.16,1,0.3,1)",
        "scale-in":   "scaleIn 0.2s ease-out",
        "slide-down": "slideDown 0.3s cubic-bezier(0.16,1,0.3,1)",
        "spin":       "spin 1s linear infinite",
      },
      keyframes: {
        fadeIn:    { from: { opacity: "0" },                                        to: { opacity: "1" } },
        slideUp:   { from: { transform: "translateY(16px)", opacity: "0" },         to: { transform: "translateY(0)",   opacity: "1" } },
        slideDown: { from: { transform: "translateY(-12px)", opacity: "0" },        to: { transform: "translateY(0)",   opacity: "1" } },
        scaleIn:   { from: { transform: "scale(0.95)",       opacity: "0" },        to: { transform: "scale(1)",        opacity: "1" } },
      },
    },
  },
  plugins: [],
};

export default config;
