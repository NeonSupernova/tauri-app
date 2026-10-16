//! Native backend. Commands here run as native Rust and can use OS APIs and Tauri plugins.
//! Shared logic lives in `app-core`; the frontend reaches both through `src/lib/platform.ts`.
//! Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

/// Native counterpart of the WASM `qr_svg` export.
#[tauri::command]
fn qr_svg(text: &str) -> Result<String, String> {
    app_core::qr::qr_svg(text)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_os::init())
        .invoke_handler(tauri::generate_handler![qr_svg])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
