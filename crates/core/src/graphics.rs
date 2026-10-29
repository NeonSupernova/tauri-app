/// A CPU pixel renderer writing into an RGBA8 buffer.
///
/// The frontend draws the buffer straight onto a `<canvas>`; in the browser the buffer lives in
/// WASM memory, so no copy is needed. Swap `plasma` for your own per-pixel work (image filters,
/// fractals, simulations, ...).
pub struct Framebuffer {
    pub width: u32,
    pub height: u32,
    pub pixels: Vec<u8>,
}

impl Framebuffer {
    pub fn new(width: u32, height: u32) -> Self {
        Self { width, height, pixels: vec![0; (width * height * 4) as usize] }
    }

    /// Render an animated plasma effect at time `t` (seconds).
    pub fn plasma(&mut self, t: f32) {
        let (w, h) = (self.width as f32, self.height as f32);
        for (i, px) in self.pixels.as_chunks_mut::<4>().0.iter_mut().enumerate() {
            let x = (i as u32 % self.width) as f32 / w;
            let y = (i as u32 / self.width) as f32 / h;
            let v = (x * 10.0 + t).sin()
                + (y * 10.0 + t * 1.3).sin()
                + ((x + y) * 10.0 + t * 0.7).sin()
                + (((x - 0.5).powi(2) + (y - 0.5).powi(2)).sqrt() * 20.0 - t * 2.0).sin();
            let v = v * std::f32::consts::PI / 4.0;
            px[0] = ((v.sin() * 0.5 + 0.5) * 255.0) as u8;
            px[1] = (((v + 2.094).sin() * 0.5 + 0.5) * 255.0) as u8;
            px[2] = (((v + 4.188).sin() * 0.5 + 0.5) * 255.0) as u8;
            px[3] = 255;
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn fills_every_pixel_opaque() {
        let mut fb = Framebuffer::new(8, 4);
        fb.plasma(1.0);
        assert_eq!(fb.pixels.len(), 8 * 4 * 4);
        assert!(fb.pixels.as_chunks::<4>().0.iter().all(|p| p[3] == 255));
    }
}
