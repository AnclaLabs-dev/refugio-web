import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api-proxy": {
        target: "https://refugio-api-production-1c49e3aa.up.railway.app",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-proxy/, ""),
      },
    },
  },
});

