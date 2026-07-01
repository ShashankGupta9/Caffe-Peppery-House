import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        aureolin: "#fbe311",
        bistre: "#261606",
        caramel: "#004b36",
        raisin: "#111111",
        cream: "#ffffff",
        espresso: "#111111",
        dusk: "#111111",
        // Campos Design System
        primary: '#004b36',
        'on-primary': '#ffffff',
        'primary-container': '#e6f0ed',
        'on-primary-container': '#00251a',
        secondary: '#f9f9f9',
        'on-secondary': '#111111',
        tertiary: '#eaeaea',
        'on-tertiary': '#111111',
        surface: '#ffffff',
        'surface-dim': '#f9f9f9',
        'surface-bright': '#ffffff',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f9f9f9',
        'surface-container': '#f1f1f1',
        'surface-container-high': '#eaeaea',
        'surface-container-highest': '#e0e0e0',
        'surface-variant': '#e0e0e0',
        'on-surface': '#111111',
        'on-surface-variant': '#444444',
        outline: '#cccccc',
        'outline-variant': '#eaeaea',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      fontFamily: {
        display: ["var(--font-display)", "Playfair Display", "Georgia", "serif"],
        accent: ["var(--font-accent)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-sans)", "DM Sans", "sans-serif"],
        hand: ["var(--font-hand)", "cursive"],
      },
    },
  },
  plugins: [],
};
export default config;
