/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        crema: '#F9F8F6',
        cacao: '#34231F',
        terracota: '#7C2D12',
        dorado: '#C59B45',
      },
      boxShadow: {
        soft: '0 18px 45px rgba(52, 35, 31, 0.08)',
      },
    },
  },
  plugins: [],
};
