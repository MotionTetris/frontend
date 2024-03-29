import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  plugins: [wasm(), topLevelAwait(), react()],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
      '@api': path.resolve(__dirname, './src/api'),
      '@app': path.resolve(__dirname, './src/app'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@redux': path.resolve(__dirname, './src/redux'),
      '@mocks': path.resolve(__dirname, './src/mocks'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@util': path.resolve(__dirname, './src/util'),
      '@type': path.resolve(__dirname, './src/types'),
      '@context': path.resolve(__dirname, './src/context'),
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://jeongminjo.shop:3000/",
        changeOrigin: true,
        rewrite: (path) => {
          const newPath = path.replace(/^\/api/, '');
          console.log(newPath);
          return newPath;
        }
      },
      "/room-api": {
        target: "http://54.180.148.103:3000/",
        changeOrigin: true,
        rewrite: (path) => {
          const newPath = path.replace('/room-api', '/room');
          console.log(newPath);
          return newPath;
        }
      }
    }
  }
});
