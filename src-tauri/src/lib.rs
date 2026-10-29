#[tauri::command]
fn qr_svg(text: &str) -> Result<String, String> { app_core::qr::qr_svg(text) }

#[cfg(desktop)]
#[derive(serde::Serialize)]
struct AvailableUpdate {
    version: String,
    notes: Option<String>,
}

#[cfg(desktop)]
#[tauri::command]
async fn check_for_updates(app: tauri::AppHandle) -> Result<Option<AvailableUpdate>, String> {
    use tauri_plugin_updater::UpdaterExt;

    if option_env!("TAURI_UPDATER_ENABLED") != Some("1") { return Ok(None); }
    let updater = app.updater().map_err(|error| error.to_string())?;
    let update = updater.check().await.map_err(|error| error.to_string())?;

    Ok(update.map(|release| AvailableUpdate {
        version: release.version.to_string(),
        notes: release.body,
    }))
}

#[cfg(desktop)]
#[tauri::command]
async fn install_update(
    app: tauri::AppHandle,
    expected_version: String,
) -> Result<(), String> {
    use tauri_plugin_updater::UpdaterExt;

    if option_env!("TAURI_UPDATER_ENABLED") != Some("1") { return Err("Updates are disabled in this build.".into()); }
    let updater = app.updater().map_err(|error| error.to_string())?;
    let update = updater
        .check()
        .await
        .map_err(|error| error.to_string())?
        .ok_or_else(|| "The update is no longer available".to_string())?;

    // Avoid silently installing a different version from the one the user approved.
    if update.version.to_string() != expected_version {
        return Err("The available version changed. Check for updates again.".into());
    }

    update
        .download_and_install(|_, _| {}, || {})
        .await
        .map_err(|error| error.to_string())?;

    // On Windows the updater installer may terminate the running application.
    // On macOS/Linux the new app is launched after installation.
    app.restart();
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_os::init());
    #[cfg(desktop)]
    let builder = {
        let builder = if option_env!("TAURI_UPDATER_ENABLED") == Some("1") {
            builder.plugin(tauri_plugin_updater::Builder::new().build())
        } else { builder };
        builder.invoke_handler(tauri::generate_handler![qr_svg, check_for_updates, install_update])
    };
    #[cfg(not(desktop))]
    let builder = builder.invoke_handler(tauri::generate_handler![qr_svg]);
    builder.run(tauri::generate_context!()).expect("error while running tauri application");
}
