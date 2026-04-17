/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:       "#0f0d0a",
        surface:  "#181410",
        surface2: "#211c16",
        surface3: "#2a2318",
        accent:   "#c4956a",
        lavender: "#b8a9d4",
        online:   "#7ec8a0",
      },
      keyframes: {
        "msg-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "msg-in": "msg-in 0.25s ease-out forwards",
      },
    },
  },
  plugins: [],
};
