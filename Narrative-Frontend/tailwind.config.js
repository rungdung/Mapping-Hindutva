/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,svelte,js,svx,css}",
    "./node_modules/svelte-ux/**/*.{svelte,js}",
    "./node_modules/layerchart/**/*.{svelte,js}",
  ], // <--- Add this"],
  theme: {
    extend: {},
  },
  plugins: [],
};
