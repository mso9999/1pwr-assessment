import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base so static hosting works on GitHub Pages project URLs and elsewhere.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
