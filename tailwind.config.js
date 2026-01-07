
/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography'; // Import the plugin

export default {
  content: [
    "./index.html",
    // Assumes App.tsx and other components are at the root level.
    // Adjust if you move components into a 'src/' folder later.
    "./*.{js,ts,jsx,tsx}" 
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    typography, // Use the imported plugin
  ],
};
