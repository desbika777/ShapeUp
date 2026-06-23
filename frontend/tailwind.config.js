/** @type {import('tailwindcss').Config} */
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
        panel: '0 18px 50px rgba(15, 39, 64, 0.12)',
      },
      backgroundImage: {
        'hero-mesh': 'radial-gradient(circle at top left, rgba(20,184,166,0.28), transparent 40%), radial-gradient(circle at top right, rgba(15,118,110,0.18), transparent 28%), linear-gradient(180deg, #f8fffe 0%, #eef4f7 100%)',
      },
    },
  },
  plugins: [],
};
