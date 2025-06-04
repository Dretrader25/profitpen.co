/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // This enables class-based dark mode
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Paths to your Next.js app directory components and pages
    './components/**/*.{js,ts,jsx,tsx,mdx}', // Paths to your components directory
  ],
  theme: {
    extend: {
      // You can extend your theme here if needed in the future
      // For example, for specific dark mode colors not covered by Tailwind defaults:
      // colors: {
      //   dark: {
      //     background: '#121212',
      //     text: '#e0e0e0',
      //     primary: '#bb86fc',
      //   }
      // }
    },
  },
  plugins: [
    // Add any Tailwind plugins you might be using or plan to use,
    // e.g., require('@tailwindcss/typography'), require('@tailwindcss/forms')
  ],
};
