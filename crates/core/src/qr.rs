use qrcode::QrCode;
use qrcode::render::svg;

/// Encode `text` as a QR code and render it as a standalone SVG document.
pub fn qr_svg(text: &str) -> Result<String, String> {
    let code = QrCode::new(text.as_bytes()).map_err(|e| e.to_string())?;
    Ok(code
        .render::<svg::Color>()
        .min_dimensions(256, 256)
        .quiet_zone(true)
        .build())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn renders_svg() {
        let svg = qr_svg("https://tauri.app").unwrap();
        assert!(svg.starts_with("<?xml"));
        assert!(svg.contains("<svg"));
    }

    #[test]
    fn rejects_oversized_input() {
        assert!(qr_svg(&"x".repeat(10_000)).is_err());
    }
}
