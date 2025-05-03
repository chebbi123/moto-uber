import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Moto Uber',
        short_name: 'MotoUber',
        description: 'Fast and affordable motorcycle rides in Tunisia.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg}'], // Ensure all necessary files are cached
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
  css: {
    preprocessorOptions: {
      css: {
        additionalData: '@import "./src/index.css";', // Ensure Tailwind is included globally
      },
    },
  },
  server: {
    historyApiFallback: true,
  },
});
