import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8080,
  },
  esbuild: {
    drop: process.env.NODE_ENV === "production" ? ["console"] : [],
  },
});
