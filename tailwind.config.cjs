module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        leaf: {
          50: '#fffaf0',
          100: '#edf5df',
          200: '#9ee47d',
          300: '#e5372b',
          400: '#1e3ad6',
          500: '#2a9d54',
          600: '#1e3ad6',
          700: '#41495c',
          800: '#e5dfd2',
          900: '#17213b',
        },
        cream: '#f5eddc',
        brand: {
          green: '#2a9d54',
          blue: '#1e3ad6',
          red: '#e5372b',
          yellow: '#f5c518',
          orange: '#f0941f',
          pink: '#ff92b6',
          dark: '#17213b',
        },
      },
    },
  },
  plugins: [],
};
