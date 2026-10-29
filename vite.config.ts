import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import adapter from "@sveltejs/adapter-static";
import tailwindcss from "@tailwindcss/vite";

const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    // Tauri doesn't have a Node.js server to do proper SSR,
    // so we use adapter-static to prerender the app (SSG).
    // See: https://v2.tauri.app/start/frontend/sveltekit/
    sveltekit({
      preprocess: vitePreprocess(),
      adapter: adapter(),
      // Content Security Policy, emitted as a <meta> tag with hashes for SvelteKit's inline
      // scripts, so it applies on the web and inside Tauri alike.
      csp: {
        mode: "hash",
        directives: {
          "default-src": ["self"],
          // WebAssembly.instantiate needs 'wasm-unsafe-eval'
          "script-src": ["self", "wasm-unsafe-eval"],
          "style-src": ["self", "unsafe-inline"],
          "img-src": ["self", "data:", "blob:"],
          // ipc: / http://ipc.localhost carry Tauri commands; add your API origins here
          "connect-src": ["self", "ipc:", "http://ipc.localhost"],
          "object-src": ["none"],
          "base-uri": ["self"],
        },
      },
    }),
  ],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring Rust errors
  clearScreen: false,
  // 2. Tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
});
