import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', ...defaultTheme.fontFamily.sans],
        display: ["Fraunces", "Georgia", "serif"],
      },
      colors: {
        brand: {
          forest: "#14532d",
          leaf: "#166534",
          jade: "#15803d",
          gold: "#b45309",
          honey: "#ca8a04",
          sand: "#fffbeb",
          mist: "#ecfdf5",
        },
      },
      backgroundImage: {
        /* Reference: forest green → golden brown (horizontal, full app + header) */
        "herbal-gradient":
          "linear-gradient(90deg, #388e3c 0%, #43a047 28%, #6d8f3a 52%, #8f7730 78%, #9e7d31 100%)",
        "brand-bar": "linear-gradient(90deg, #388e3c 0%, #43a047 28%, #6d8f3a 52%, #8f7730 78%, #9e7d31 100%)",
        "brand-shell":
          "linear-gradient(90deg, #388e3c 0%, #43a047 28%, #6d8f3a 52%, #8f7730 78%, #9e7d31 100%)",
        "brand-glass":
          "linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.72) 100%)",
        "brand-nav":
          "linear-gradient(90deg, #388e3c 0%, #43a047 28%, #6d8f3a 52%, #8f7730 78%, #9e7d31 100%)",
      },
      boxShadow: {
        panel:
          "0 1px 2px rgba(15, 23, 42, 0.04), 0 12px 40px -8px rgba(20, 83, 45, 0.12)",
        nav: "0 4px 24px -4px rgba(15, 23, 42, 0.08)",
        glow: "0 8px 32px rgba(22, 101, 52, 0.15)",
      },
      animation: {
        "gradient-shift": "gradient-shift 14s ease infinite",
        "herbal-spin": "herbal-spin 0.75s linear infinite",
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "herbal-spin": {
          to: { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};
