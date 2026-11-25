import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";


export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5000,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      three: "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
    },
  },
  build: {
    rollupOptions: {
      external: ["three"],
    },
  },
}));
