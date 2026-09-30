import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Relative base so the build works both on GitHub Pages (/Gabrielas/) and on a custom domain.
export default defineConfig({ base: "./", plugins: [react(), tailwindcss()] });
