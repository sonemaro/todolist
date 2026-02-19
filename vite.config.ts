import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5188,
    proxy: {
      '/api': 'http://localhost:3456',
      '/uploads': 'http://localhost:3456',
    },
  },
});
