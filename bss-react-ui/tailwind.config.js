/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontSize: {
      xs: ['12px', '16px'],
      sm: ['14px', '20px'],
      base: ['16px', '19.5px'],
      lg: ['18px', '21.94px'],
      xl: ['20px', '24.38px'],
      '2xl': ['24px', '29.26px'],
      '3xl': ['28px', '50px'],
      '4xl': ['48px', '58px'],
      '8xl': ['96px', '106px']
    },
    extend: {
      fontFamily: {
        nunito: ['nunito', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        palanquin: ['Palanquin', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        lora: ['Lora', 'serif'],
      },
      colors: {
        'success': "#009933",
        'primary': "#1E3A8A",
        "secondary": "#191970",
        "coral-red": "#FF6452",
        "slate-gray": "#6D6D6D",
        "pale-blue": "#F5F6FF",
        "white-400": "rgba(255, 255, 255, 0.80)",
        "dark-primary": "#121212",
        "dark-primary-text": "#FFFFFF",
        "dark-secondary-text": "#B0B0B0",
        "dark-accent": "#1E88E5",
        "dark-error": "#E53935",
        "dark-warning": "#FFB300",
        "dark-divider": "#424242",
        "primary-blue": "#4169E1"


      },
      boxShadow: {
        '3xl': '0 10px 40px rgba(0, 0, 0, 0.1)'
      },
      backgroundImage: {
        'hero': "url('assets/images/collection-background.svg')",
        'card': "url('assets/images/thumbnail-background.svg')",
      },
      screens: {
        "wide": "1440px"
      }
    },
  },
  variants: {
    display: ['responsive'], // Ensure responsive variants are enabled
  },
  plugins: [],
}