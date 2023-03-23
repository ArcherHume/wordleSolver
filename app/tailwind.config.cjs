/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      backgroundColor: {
        primary: "#D2FFA0",
        secondary: "#FFD56B",
        box: "#fafafa",
        white: "#FFFFFF",
        dark: "#383734",
      },
    },
  },
  plugins: [],
};
