import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";

// Used when connecting to the dev server from a mobile device.
const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  clearScreen: false,
  server: {
    // Must match src-tauri/tauri.conf.json > build.devUrl.
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? { protocol: "ws", host, port: 1421 }
      : undefined,
    watch: { ignored: ["**/src-tauri/**"] },
  },
});
