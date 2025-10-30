import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default defineConfig({
  root: "./",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        menu: path.resolve(__dirname, "menu.html"),
        register: path.resolve(__dirname, "register.html"),
        signin: path.resolve(__dirname, "signin.html"),
        cart: path.resolve(__dirname, "cart.html"),
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: "@use \"/src/scss/_variables.scss\" as *;"
      }
    }
  },
  esbuild: {
    target: "esnext",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@ts": path.resolve(__dirname, "./src/ts"),
      "@scss": path.resolve(__dirname, "./src/scss"),
    },
  },
});
