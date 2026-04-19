export const colors = {
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
} as const;

export const typography = {
  fontFamily: {
    sans:    ["Inter", "system-ui", "sans-serif"],
    display: ["Sora", "Inter", "sans-serif"],
  },
  fontSize: {
    xs:   "0.75rem",
    sm:   "0.875rem",
    base: "1rem",
    lg:   "1.125rem",
    xl:   "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
  },
} as const;

export const spacing = {
  1: "4px",  2: "8px",   3: "12px", 4: "16px",
  5: "20px", 6: "24px",  8: "32px", 10: "40px",
  12: "48px", 16: "64px", 20: "80px",
} as const;

export const radius = {
  sm: "6px", md: "12px", lg: "16px", xl: "24px", full: "9999px",
} as const;

export const shadow = {
  sm:   "0 1px 3px rgba(0,0,0,0.08)",
  md:   "0 4px 16px rgba(0,0,0,0.10)",
  card: "0 2px 12px rgba(249,115,22,0.08)",
} as const;
