# Tauri + SvelteKit + TypeScript

A Tauri 2 desktop app with a SvelteKit (static adapter) frontend, styled with Tailwind CSS 4 and Skeleton, plus a Rust crate compiled to WebAssembly (`wasm/`).

## Prerequisites

- [Bun](https://bun.sh)
- Rust with the `wasm32-unknown-unknown` target: `rustup target add wasm32-unknown-unknown`
- [wasm-pack](https://rustwasm.github.io/wasm-pack/): `cargo install wasm-pack`
- The [Tauri system dependencies](https://v2.tauri.app/start/prerequisites/) for your platform

## Scripts

| Command | What it does |
| --- | --- |
| `bun run tdev` | Run the desktop app with hot reload |
| `bun run tbuild` | Build the desktop app bundle |
| `bun run dev` | Run only the frontend at http://localhost:1420 (Tauri commands are unavailable) |
| `bun run build` | Build the static frontend into `build/` |
| `bun run check` | Type-check the Svelte/TypeScript code |
| `bun run wasm-build` | Compile `wasm/` into `src/lib/wasm` (runs automatically before `dev`, `build` and `check`) |

`src/lib/wasm` is generated and git-ignored.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer).

Dev, build, check, and watch scripts explicitly build WASM first; no lifecycle-hook support is required.
