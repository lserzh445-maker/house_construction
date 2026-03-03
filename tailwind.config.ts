import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B5E20',
          light: '#2E7D32',
          dark: '#145214',
          50: '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          500: '#4CAF50',
          700: '#388E3C',
          900: '#1B5E20',
        },
        secondary: {
          DEFAULT: '#0288D1',
          light: '#03A9F4',
          dark: '#01579B',
          50: '#E1F5FE',
          100: '#B3E5FC',
          500: '#03A9F4',
          700: '#0288D1',
          900: '#01579B',
        },
        accent: {
          DEFAULT: '#FF9100',
          light: '#FFAB40',
          dark: '#E65100',
          50: '#FFF3E0',
          100: '#FFE0B2',
          500: '#FF9800',
          700: '#F57C00',
          900: '#E65100',
        },
        neutral: {
          dark: '#424242',
          medium: '#757575',
          light: '#F5F5F5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Open Sans', 'Roboto', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      screens: {
        xs: '320px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
        },
      },
    },
  },
  plugins: [],
}

export default config