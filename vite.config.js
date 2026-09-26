import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages project site: https://<user>.github.io/1pwr-assessment/
// Override with VITE_BASE_PATH for other hosts (e.g. "./" or "/assessment/").
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || "/1pwr-assessment/",
});
