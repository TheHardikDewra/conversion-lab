import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  root: path.resolve(root, "client"),
  server: {
    // Replit (and similar hosts) proxy the dev server through a generated
    // hostname, which Vite's DNS-rebinding protection rejects by default -
    // the preview pane shows "Blocked request. This host is not allowed."
    // Dev-only setting; the production server never runs Vite.
    allowedHosts: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(root, "client", "src"),
      "@shared": path.resolve(root, "shared"),
    },
  },
  build: {
    outDir: path.resolve(root, "dist", "public"),
    emptyOutDir: true,
  },
});
