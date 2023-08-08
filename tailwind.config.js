/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        primary: ['var(--font-josefin-sans)'],
      },
      colors: {
        //  Primary
        'bright-blue': 'hsl(220, 98%, 61%)',
        'check-background-start': 'hsl(192, 100%, 67%)',
        'check-background-stop': 'hsl(280, 87%, 65%)',

        // Neutral

        // Light Theme
        'very-light-gray': 'hsl(0, 0%, 98%)',
        'very-light-grayish-blue': 'hsl(236, 33%, 92%)',
        'light-grayish-blue': 'hsl(233, 11%, 84%)',
        'dark-grayish-blue': 'hsl(236, 9%, 61%)',
        'very-dark-grayish-blue': 'hsl(235, 19%, 35%)',

        // Dark Theme
        'very-dark-blue': 'hsl(235, 21%, 11%)',
        'very-dark-desaturated-blue': 'hsl(235, 24%, 19%)',
        'light-grayish-blue': 'hsl(234, 39%, 85%)',
        'light-grayish-blue-alt': 'hsl(236, 33%, 92%)', // hover
        'dark-grayish-blue-alt': 'hsl(234, 11%, 52%)',
        'very-dark-grayish-blue': 'hsl(233, 14%, 35%)',
        'very-dark-grayish-blue-alt': 'hsl(237, 14%, 26%)',
      }
    },
  },
  plugins: [],
}