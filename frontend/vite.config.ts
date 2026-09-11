// Configuracao do Vite para rodar React, aliases e testes unitarios.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Alias @ deixa imports do frontend mais curtos e organizados.
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    // jsdom simula navegador para testes de componentes React.
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    exclude: ['e2e/**', 'node_modules/**'],
  },
});
