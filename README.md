# Tauri + SvelteKit + Rust template

A [cargo-generate](https://github.com/cargo-generate/cargo-generate) template for apps that run from one codebase
as a **website** and as a **desktop/mobile app**, with Rust doing the heavy lifting in both:

- **SvelteKit 3** (Svelte 5, Vite 8, TypeScript 6) prerendered to static files, styled with Tailwind 4 + Skeleton 5
- **Tauri 2** for native windows, OS APIs (plugins) and mobile
- **Shared Rust core** (`crates/core`) compiled natively for Tauri *and* to WebAssembly for the browser
- **Platform layer** (`src/lib/platform.ts`) that picks native Rust under Tauri and WASM on the web
- Demos: QR codes (Rust `qrcode` crate) and a real-time canvas renderer driven by WASM memory
- Content Security Policy on both targets, CI for the web build, Rust tests and the Tauri build

## Create an app

```sh
cargo install cargo-generate
cargo generate NeonSupernova/tauri-app --name my-app
cd my-app && bun install && bun run tdev
```

You'll be asked for a bundle identifier (e.g. `com.yourname.myapp`) and a description; pass them with
`--define identifier=... --define description=...` to skip the prompts. The generated project's README covers
prerequisites, commands and how to add capabilities.

## Working on the template

The repo is itself a working app with default values (`tauri-app`, `com.example.tauri-app`), so everything in
the generated README works here too. Template-specific files:

| File                                | Purpose                                                                  |
| ----------------------------------- | ------------------------------------------------------------------------ |
| `cargo-generate.toml`               | Placeholders, which files get rendered, what's left out                  |
| `src-tauri/tauri.conf.json.liquid`  | Replaces `tauri.conf.json` in generated apps; **keep the two in sync**   |
| `README.md.liquid`                  | Becomes the generated project's README (this file is template-only)      |
| `.github/workflows/template.yml`    | Generates a project and builds it; also fails if the `.liquid` twin drifts |

`package.json` and `src/app.html` contain `{{project-name}}`-style placeholders directly; that's harmless for the
tools that read them.

To try the template locally: `cargo generate --path . --name scratch-app --destination /tmp`.

## Releases and updates

See [DISTRIBUTION.md](DISTRIBUTION.md) for signing configuration and the stable release workflow. Merge order for this change is PR #2, then #1, then #3.
