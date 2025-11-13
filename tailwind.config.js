/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF4500",
        secondary: "#0079D3",
        accent: "#FF8717",
        upvote: "#FF4500",
        downvote: "#0079D3",
        success: "#46D160",
        warning: "#FFB000",
        error: "#EA0027",
        info: "#0079D3",
        surface: "#FFFFFF",
        background: "#F8F9FA",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 8px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}