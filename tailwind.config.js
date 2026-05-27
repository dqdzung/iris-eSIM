/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/app/**/*.{js,ts,tsx}', './src/components/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  presets: [require('nativewind/preset')],
  theme: {
    fontSize: {
      xxs: ['0.625rem', '0.875rem'],
      xs: ['0.75rem', '1rem'],
      sm: ['0.875rem', '1.25rem'],
      base: ['1rem', '1.5rem'],
      lg: ['1.125rem', '1.75rem'],
      xl: ['1.25rem', '1.75rem'],
      xxl: ['1.5rem', '2rem'],
    },
    extend: {
      colors: {
        // primary: '#7644B4',
        primary: 'rgba(88, 80, 232, 1)',
      },
    },
  },
  plugins: [],
};
