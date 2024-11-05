// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust this if your project structure is different
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")], // Include daisyUI as a plugin if you're using it
};
