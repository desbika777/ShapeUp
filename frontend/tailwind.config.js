/** @type {import('tailwindcss').Config} */
// Configuracao visual do frontend: cores, fontes, sombras e fundo base.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b1720',
        mist: '#f5f7f8',
        surface: '#ffffff',
        teal: '#0f766e',
        mint: '#14b8a6',
        slateblue: '#0f2740',
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Sora', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 12px 32px rgba(15, 39, 64, 0.10)',
      },
      backgroundImage: {
        'hero-mesh': 'linear-gradient(180deg, #f8fbfc 0%, #eef3f5 100%)',
      },
    },
  },
  plugins: [],
};
