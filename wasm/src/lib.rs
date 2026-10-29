//! Thin `wasm-bindgen` wrappers around `app-core`, consumed by the frontend via `#lib/wasm`.
//! Prefer `src/lib/platform.ts` over importing this directly so code also runs under Tauri.

use app_core::graphics::Framebuffer;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn qr_svg(text: &str) -> Result<String, JsError> {
    app_core::qr::qr_svg(text).map_err(|e| JsError::new(&e))
}

/// Pixel renderer whose RGBA buffer lives in WASM memory.
/// Read it zero-copy via `new Uint8ClampedArray(memory.buffer, r.ptr(), r.byteLen())`.
#[wasm_bindgen]
pub struct Renderer(Framebuffer);

#[wasm_bindgen]
impl Renderer {
    #[wasm_bindgen(constructor)]
    pub fn new(width: u32, height: u32) -> Renderer {
        Renderer(Framebuffer::new(width, height))
    }

    pub fn render(&mut self, t: f32) {
        self.0.plasma(t);
    }

    pub fn ptr(&self) -> *const u8 {
        self.0.pixels.as_ptr()
    }

    #[wasm_bindgen(js_name = byteLen)]
    pub fn byte_len(&self) -> usize {
        self.0.pixels.len()
    }
}
