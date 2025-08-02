import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  root: '.',
  server: { port: 5173, open: true },
  build: { outDir: 'dist', emptyOutDir: true, rollupOptions: { input: 'public/index.html' } },
});
