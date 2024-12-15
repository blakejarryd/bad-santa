/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'santa-red': '#DC3B2C',
        'santa-green': '#1B4332',
        'santa-gray': '#4B5563',
        'santa-light': '#F3F4F6',
      },
    },
  },
  plugins: [],
}