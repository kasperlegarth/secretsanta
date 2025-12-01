/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#f5e6d3',
          dark: '#d4c4a8',
          light: '#faf5ed'
        },
        christmas: {
          red: '#c85a54',
          green: '#2d5016',
          'green-dark': '#1a3009'
        }
      },
      borderWidth: {
        '3': '3px'
      }
    },
  },
  plugins: [],
}
