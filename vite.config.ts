import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {

        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (
          warning.message?.includes('@import') &&
          warning.message?.includes('deprecated')
        ) {
          return;
        }
        warn(warning);
      }
    }
  }

});
