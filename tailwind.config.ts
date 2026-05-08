import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#101316",
        paper: "#f4f1e8",
        muted: "#5b6570",
        line: "#d7dde2",
        moss: "#0d6b57",
        ocean: "#245f9f",
        ember: "#b9464f",
        gold: "#bd872b"
      },
      boxShadow: {
        panel: "0 18px 54px rgba(22, 28, 33, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
