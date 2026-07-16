import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "src/app"),
      "@data": path.resolve(__dirname, "src/data"),
      "@domain": path.resolve(__dirname, "src/domain"),
      "@redux": path.resolve(__dirname, "src/app/redux"),
    },
  },

  base: "/CRUD/",

  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-redux', '@reduxjs/toolkit'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          antd: ['antd'],
        },
      },
    },
  },
});