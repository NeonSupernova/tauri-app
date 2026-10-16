# Tauri + SvelteKit + TypeScript

This template should help get you started developing with Tauri, SvelteKit and TypeScript in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer).

## Prerequisites

- [Bun](https://bun.sh/)
- [Rust](https://rustup.rs/) with the WASM target: `rustup target add wasm32-unknown-unknown`
- [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)

## Development

```sh
bun install
bun run tdev     # builds the WASM crate, starts Vite on :1420 and launches the Tauri window
bun run tbuild   # production bundle
```

The `wasm/` crate compiles into `src/lib/wasm` (generated, git-ignored). Run `bun run wasm-build`
after changing it, or before `bun run dev` / `bun run check` when working on the frontend alone.
