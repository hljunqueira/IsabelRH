import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    outDir: "../dist/public",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../shared"),
      "@assets": path.resolve(__dirname, "../attached_assets"),
    },
  },
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/attached_assets': {
        target: 'http://localhost:5174',
        changeOrigin: false,
        rewrite: (path) => path.replace(/^\/attached_assets/, '/@assets'),
      },
    },
    fs: {
      strict: false,
      allow: ['..'],
    },
  },
}); 