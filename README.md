# Tauri + SvelteKit + TypeScript

A desktop app built with [Tauri 2](https://tauri.app), [SvelteKit 3](https://svelte.dev/docs/kit) (Svelte 5 runes),
[Vite 8](https://vite.dev), [Tailwind CSS 4](https://tailwindcss.com) + [Skeleton 5](https://skeleton.dev),
and a Rust → WebAssembly crate.

## Prerequisites

- [Bun](https://bun.sh/) and Node.js ≥ 22.17
- [Rust](https://rustup.rs/) (edition 2024) with the WASM target: `rustup target add wasm32-unknown-unknown`
- [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)
- Tauri's [system dependencies](https://v2.tauri.app/start/prerequisites/) for your OS

## Development

```sh
bun install
bun run tdev     # builds the WASM crate, starts Vite on :1420 and launches the Tauri window
bun run tbuild   # production bundle
bun run check    # type-check
```

## Layout

| Path        | What                                                                       |
| ----------- | -------------------------------------------------------------------------- |
| `src/`      | SvelteKit frontend (prerendered with `adapter-static`)                     |
| `src-tauri/`| Tauri / Rust backend; commands live in `src-tauri/src/lib.rs`              |
| `wasm/`     | Rust crate compiled to WASM into `src/lib/wasm` (generated, git-ignored)   |

SvelteKit config lives in `vite.config.ts` (passed to the `sveltekit()` plugin). Import from `src/lib`
with `#lib/...` (Node subpath imports, configured in `package.json`).

Run `bun run wasm-build` after changing the `wasm/` crate, or before `bun run dev` / `bun run check` when working
on the frontend alone.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer).
