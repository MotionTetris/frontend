import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import wasm from "vite-plugin-wasm";

export default defineConfig({
  plugins: [wasm(), react()],
  resolve: {
    alias: {
      '@api': path.resolve(__dirname, './src/api'),
      '@app': path.resolve(__dirname, './src/app'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@redux': path.resolve(__dirname, './src/redus'),
      '@mocks': path.resolve(__dirname, './src/mocks'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@util': path.resolve(__dirname, './src/util'),
      '@types': path.resolve(__dirname, './src/types'),
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "https://jeongminjo.shop",
        changeOrigin: true,
        rewrite: (path) => {
          const newPath = path.replace(/^\/api/, '');
          console.log(newPath);
          return newPath
        }
      }
    }
  }
});
