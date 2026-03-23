/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a3a5c',
          light: '#2d6a9f',
        },
        accent: '#c9a84c',
        background: '#f0f4f8',
        surface: '#ffffff',
        text: {
          DEFAULT: '#1e2a3a',
          muted: '#6b7a8d',
        },
        success: '#2e7d52',
        danger: '#c0392b',
        border: '#d1dce8',
      },
      fontFamily: {
        title: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
