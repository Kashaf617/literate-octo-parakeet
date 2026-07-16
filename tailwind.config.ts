import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#000000", 2: "#111111" },
        brand: { DEFAULT: "#000000", dark: "#C9A227", pale: "#fcfcfc" },
        ink: "#111111",
        sub: "#555555",
        line: "#DFD1A5",
        bg: "#F9F9F9",
        success: "#2fa84f",
        danger: "#e0362c",
        warn: "#f5921f",
        star: "#C9A227",
        gold: { DEFAULT: "#C9A227", dark: "#A8831B", light: "#F2E8CB" }
      },
      fontFamily: {
        sans: ["Montserrat", "Poppins", "system-ui", "sans-serif"],
        heading: ["Playfair Display", "serif"]
      },
      boxShadow: {
        card: "0 2px 10px rgba(18,32,67,.06)",
        lg2: "0 12px 32px rgba(18,32,67,.14)"
      },
      borderRadius: { xl2: "14px" },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-33.3333%)' }
        }
      },
      animation: {
        marquee: 'marquee linear infinite'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
};
export default config;
