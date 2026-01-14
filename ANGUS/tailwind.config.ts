import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#0d0f12",
          700: "#1c1f26",
          500: "#2b2f38"
        },
        mist: {
          50: "#f7f6f2",
          200: "#e7e1d7",
          400: "#c7bdae"
        },
        ember: {
          600: "#d9774f",
          700: "#c65d2d"
        },
        creek: {
          500: "#2a6f77",
          600: "#205e64"
        }
      },
      boxShadow: {
        card: "0 18px 50px -20px rgba(15, 23, 42, 0.45)",
        soft: "0 8px 30px rgba(15, 23, 42, 0.16)"
      },
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "'Trebuchet MS'", "sans-serif"],
        body: ["'IBM Plex Sans'", "'Segoe UI'", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
