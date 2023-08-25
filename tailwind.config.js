/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        'list-light': '0 10px 0 clamp(2px, 1vw, 7px) hsla(0, 10%, 72.5%, 0.05), 0 20px 0 clamp(7px, 2vw, 17px) hsla(0, 10%, 72.5%, 0.05), 0 30px 0 clamp(22px, 3vw, 40px) hsla(0, 10%, 72.5%, 0.05)',
        'list-dark': '0 10px 0 clamp(2px, 1vw, 7px) hsla(0, 0%, 12.5%, 0.075), 0 20px 0 clamp(7px, 2vw, 17px) hsla(0, 0%, 12.5%, 0.085), 0 30px 0 clamp(22px, 3vw, 40px) hsla(0, 0%, 12.5%, 0.095)'
      },
      keyframes: {
        loader: {
          'from': { transform: 'translateX(0)' },
          'to': { transform: 'translateX(-100%)' }
        },
        fadeIn: { 'from': { opacity: 0 } },
        fadeOut: { 'to': { opacity: 1 } },
        slideIn: { 'from': { transform: 'translateY(1rem)' } }
      },
      animation: {
        loader: 'loader 5s linear forwards',
        toast: 'fadeIn 0.3s ease, slideIn 0.3s ease, fadeOut 0.3s ease 3s'
      },
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
        'light-grayish-blue-alt-1': 'hsl(234, 39%, 85%)',
        'light-grayish-blue-alt-2': 'hsl(236, 33%, 92%)', // hover
        'dark-grayish-blue-alt': 'hsl(234, 11%, 52%)',
        'very-dark-grayish-blue': 'hsl(233, 14%, 35%)',
        'very-dark-grayish-blue-alt': 'hsl(237, 14%, 26%)',
      }
    },
  },
  plugins: [],
}