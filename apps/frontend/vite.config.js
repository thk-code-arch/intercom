import { defineConfig } from 'vite';
import { createVuePlugin as vue } from 'vite-plugin-vue2';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: ['es2020', 'chrome90', 'edge90', 'firefox90', 'safari15'],
    // ...
  },
  server: {
    port: 8080,
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
});
