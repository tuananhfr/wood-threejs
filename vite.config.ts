import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // alias @ => src
      src: path.resolve(__dirname, "./src"), // nếu bạn muốn dùng "src/..."
    },
  },
});
