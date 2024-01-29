import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // path 모듈을 임포트합니다.

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@api': path.resolve(__dirname, './src/api'),
      '@app': path.resolve(__dirname, './src/app'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@features': path.resolve(__dirname, './src/features'),
      '@mocks': path.resolve(__dirname, './src/mocks'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@util': path.resolve(__dirname, './src/util'),
      '@types': path.resolve(__dirname, './src/types'),
    }
  }
});
