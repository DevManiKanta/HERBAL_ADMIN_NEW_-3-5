import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Recharts expects `react-is`; ensure dev + pre-bundle always resolve it
      "react-is": path.resolve(__dirname, "node_modules/react-is"),
    },
  },
  optimizeDeps: {
    include: ["react-is", "recharts"],
  },
});
