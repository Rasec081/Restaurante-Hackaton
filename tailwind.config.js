/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        crema: '#F7F8FA',
        cacao: '#111827',
        navy: '#10213D',
        graphite: '#10213D',
        terracota: '#10213D',
        success: '#20C66B',
        warning: '#FDBA2D',
        danger: '#FF5151',
        dorado: '#20C66B',
      },
      boxShadow: {
        soft: '0 18px 45px rgba(16, 33, 61, 0.08)',
      },
    },
  },
  plugins: [],
};
