# Tauri + SvelteKit + Rust/WASM starter

A reusable Tauri 2 application starter using Svelte 5, SvelteKit 2, Tailwind 4, Skeleton UI, Bun, Rust and optional Rust-generated WebAssembly.

## Development

Prerequisites: Rust, Bun, `wasm-pack`, the `wasm32-unknown-unknown` Rust target, and the [Tauri OS prerequisites](https://v2.tauri.app/start/prerequisites/).

```sh
rustup target add wasm32-unknown-unknown
cargo install wasm-pack --locked
bun install
bun run tdev
```

The frontend scripts build the WASM module automatically before starting Vite, before checking, or before building. `bun run check` runs Svelte checks; `bun run tbuild` produces local desktop bundles. Local development never requires an updater signing key.

## CI

`.github/workflows/ci.yml` validates Svelte, WASM, Rust and Tauri on Linux, Windows and macOS for pushes to `main` and pull requests.

`.github/workflows/release.yml` is triggered by version tags such as `v0.1.0`. It builds Windows, Linux, Intel macOS and Apple Silicon macOS packages, uploads signed updater artifacts to a draft GitHub Release and publishes that release **only after all builds succeed**. The official Tauri GitHub Action generates the updater `latest.json`.

## One-time release configuration

Each generated application should use its own application identifier, product name, and updater signing key. Before releasing:

1. Change `productName` and `identifier` in `src-tauri/tauri.conf.json`, and update the Rust package/library names if desired. Keep generated products' identities stable after release.
2. Generate the updater key pair locally with `bun tauri signer generate -w ~/.tauri/<your-app>.key`. **Never commit the private key.**
3. Add the **entire contents** of that private key to repository **Actions secret** `TAURI_SIGNING_PRIVATE_KEY`. If you set a password, add `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` as an Actions secret.
4. Add the public key (not the private key) to repository **Actions variable** `TAURI_UPDATER_PUBLIC_KEY`. Include the full key as generated.
5. In repository settings, ensure GitHub Actions can create Releases (the workflow uses `contents: write`).
6. For public installations, publish to a public GitHub repository: private-repository release assets are not accessible anonymously to installed applications.
7. For normal macOS customer distribution, set up **Apple code signing and notarization** with the official [Tauri macOS signing guide](https://v2.tauri.app/distribute/sign/macos/). Tauri updater signing is separate from Apple signing. Windows Authenticode signing is also recommended to improve installer trust.

Do not copy the signing key from this template into multiple independent products. Give every production app its own credentials. The signing key cannot be replaced casually without a transition plan for existing installations.

## Publish

Synchronize your intended release version with the code by tagging the release:

```sh
git tag v0.1.0
git push origin v0.1.0
```

Before tagging, commit matching versions in package.json and Cargo.toml's [workspace.package], and refresh Cargo.lock. Prerelease tags are rejected for this stable channel.

For later releases, use incrementing version tags. The release workflow creates an ignored `src-tauri/tauri.release.conf.json` overlay that verifies the committed package/workspace versions match the tag, injects the public key, configures the URL `https://github.com/OWNER/REPO/releases/latest/download/latest.json`, and enables signed updater artifacts. It intentionally does **not** modify or commit secrets to source control.

To prevent accidental release of a tag with unrelated versions, use a tag matching your intended application version. GitHub Releases must be publicly downloadable for unauthenticated updater checks. Don't use prerelease tags as the stable update channel without extending the endpoint/channel configuration.

## Automatic updates

On production desktop builds, a launch-time update check uses the official Tauri updater plugin. If a newer signed release is available, the application shows an **Install and restart** or **Later** prompt. The backend verifies that the installed version is the one the user approved before downloading and installing. The updater is disabled in ordinary local builds and browser previews. Failures are nonfatal and logged; the application remains usable.

The updater here is **desktop only**. Android and iOS distribution must use their respective app-store/platform release mechanisms.

## Notes

- The release script needs the public key as a GitHub Actions variable; the private key is passed only to Tauri's signing process.
- The `wasm` crate is a starter demonstration; remove the WASM stage in projects that don't use it.
- Code signing/notarization, real cross-platform runtime verification, and end-user release testing remain product-specific tasks. Do not treat a green CI build as a substitute for these checks.
- If the Rust dependency graph changes, regenerate and commit `Cargo.lock` with `cargo check --workspace` before tagging a release.
