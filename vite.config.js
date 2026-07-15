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
      "@redux": path.resolve(__dirname, "src/redux"),
    },
  },

  base: "/CRUD/",
});