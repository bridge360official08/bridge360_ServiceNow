import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'src/client',
  publicDir: '../../public',
  build: {
    outDir: '../../dist/static',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/client'),
    },
  },
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/api/easyocr': {
        target: 'http://127.0.0.1:8088',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/easyocr/, ''),
      },
      '/api': {
        target: 'https://dlt-hck-8017-0004.lab.service-now.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
