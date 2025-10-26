import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173,
    open: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "/src/scss/_variables.scss";`
      }
    }
  },
  esbuild: {
    target: 'esnext',
  },
});
