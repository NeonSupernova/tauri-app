//! Shared, platform-independent logic.
//!
//! Everything here compiles both natively (used by `src-tauri` as Tauri commands) and to
//! `wasm32-unknown-unknown` (exposed to the browser by the `wasm` crate). Keep it free of
//! platform APIs: no file system, threads, or `web-sys` — those belong in the wrappers.

pub mod graphics;
pub mod qr;
