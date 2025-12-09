import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Allow Cloudflare tunnel hostnames and local addresses for dev server
    allowedHosts: ["clubs.ranr.top", "backend.ranr.top", "images.ranr.top"],
    // Accept external Host headers (required for some tunnels) and ensure the expected port
    //host: true,
    port: 5173,
  },
});
