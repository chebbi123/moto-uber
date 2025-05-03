import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: 'public', // Ensure the public directory is correctly set
  root: '.', // Ensure the root directory is correctly set
  build: {
    outDir: 'dist', // Specify the output directory
  },
  server: {
    open: true, // Automatically open the browser on server start
  },
});
