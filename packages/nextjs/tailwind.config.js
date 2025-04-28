/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkTheme: "dark",
  darkMode: ["selector", "[data-theme='dark']"],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#FEE715",
          "primary-content": "#101820",
          secondary: "#C8C8C8",
          "secondary-content": "#101820",
          accent: "#101820",
          "accent-content": "#000",
          neutral: "#888888",
          "neutral-content": "#101820",
          "base-100": "#ffffff",
          "base-200": "#f3f3f3",
          "base-300": "#e2e2e2",
          "base-content": "#101820",
          info: "#5BC0EB",
          success: "#3CC47C",
          warning: "#FFD166",
          error: "#FF6B6B",

          "--rounded-btn": "9999rem",

          ".tooltip": {
            "--tooltip-tail": "6px",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
      {
        dark: {
          primary: "#FEE715",
          "primary-content": "#101820",
          secondary: "#303841",
          "secondary-content": "#FFFFFF",
          accent: "#FEE715",
          "accent-content": "#101820",
          neutral: "#1A1A1A",
          "neutral-content": "#FEE715",
          "base-100": "#101820",
          "base-200": "#1C1C1C",
          "base-300": "#2C2C2C",
          "base-content": "#FFFFFF",
          info: "#5BC0EB",
          success: "#3CC47C",
          warning: "#FFD166",
          error: "#FF6B6B",

          "--rounded-btn": "9999rem",

          ".tooltip": {
            "--tooltip-tail": "6px",
            "--tooltip-color": "oklch(var(--p))",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
    ],
  },
  theme: {
    extend: {
      fontFamily: {
        "space-grotesk": ["Space Grotesk", "sans-serif"],
      },
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
};
