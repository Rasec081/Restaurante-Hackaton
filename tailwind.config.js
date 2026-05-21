/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        crema: '#F9F8F6',
        cacao: '#34231F',
        graphite: '#1E293B',
        terracota: '#1E293B',
        dorado: '#C59B45',
      },
      boxShadow: {
        soft: '0 18px 45px rgba(30, 41, 59, 0.08)',
      },
    },
  },
  plugins: [],
};
