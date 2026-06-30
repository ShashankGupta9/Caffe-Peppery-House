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
        caramel: "#C87740",
        raisin: "#2E1F26",
        cream: "#F5ECD8",
        espresso: "#8B5A3A",
        dusk: "#4A3040",
        // Dark Roastery Design System
        primary: '#c87740',
        'on-primary': '#ffffff',
        'primary-container': '#452006',
        'on-primary-container': '#ffdbcb',
        secondary: '#c9a227',
        'on-secondary': '#362b00',
        tertiary: '#55633a',
        'on-tertiary': '#ffffff',
        surface: '#121212',
        'surface-dim': '#121212',
        'surface-bright': '#393939',
        'surface-container-lowest': '#0e0e0e',
        'surface-container-low': '#1c1b1b',
        'surface-container': '#2B1D16',
        'surface-container-high': '#32221a',
        'surface-container-highest': '#3d2b22',
        'surface-variant': '#51453e',
        'on-surface': '#F7F3EE',
        'on-surface-variant': '#d6c3b8',
        outline: '#9e8d83',
        'outline-variant': '#51453e',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      fontFamily: {
        serif: ["var(--font-graen)", "serif"],
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
