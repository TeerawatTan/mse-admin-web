import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: { "process.env": {} },
  server: {
    proxy: {
      "/api/jobTypes": {
        target: "https://bck.toat.co.th/api/webs/MasterJobType",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/jobTypes/, ""),
      },
      "/api/workPlaces": {
        target: "https://bck.toat.co.th/api/webs/MasterWorkPlace",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/workPlaces/, ""),
      },
    },
  },
});
