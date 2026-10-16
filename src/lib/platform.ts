/**
 * Platform layer: the one place that knows whether we run inside Tauri or in a plain browser.
 *
 * Components call these functions instead of `invoke()` or the WASM module directly, so the same
 * code works as a desktop/mobile app (native Rust via Tauri commands) and as a website (Rust
 * compiled to WASM, or web APIs). Add a function here for each capability you need.
 */
import { invoke, isTauri } from "@tauri-apps/api/core";

/** True inside the Tauri webview, false in a normal browser. */
export const native = isTauri();

type Wasm = typeof import("#lib/wasm/app_wasm.js");
let wasmModule: Promise<Wasm & { memory: WebAssembly.Memory }> | undefined;

/** Lazily load and initialise the WASM module (also usable inside Tauri). */
export function wasm() {
  return (wasmModule ??= import("#lib/wasm/app_wasm.js").then(async (m) => {
    const { memory } = await m.default();
    return { ...m, memory };
  }));
}

/** Render `text` as an SVG QR code: native Rust under Tauri, WASM in the browser. */
export async function qrSvg(text: string): Promise<string> {
  if (native) return invoke<string>("qr_svg", { text });
  return (await wasm()).qr_svg(text);
}

export interface PlatformInfo {
  runtime: "tauri" | "web";
  os: string;
  version: string;
}

/** Describe where we're running: OS details via the Tauri `os` plugin, or the user agent. */
export async function platformInfo(): Promise<PlatformInfo> {
  if (native) {
    const os = await import("@tauri-apps/plugin-os");
    return { runtime: "tauri", os: `${os.platform()} (${os.arch()})`, version: os.version() };
  }
  return { runtime: "web", os: navigator.platform || "unknown", version: navigator.userAgent };
}
