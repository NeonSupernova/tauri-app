<script lang="ts">
  import { onMount } from "svelte";
  import { wasm } from "#lib/platform.ts";
  import type { Renderer } from "#lib/wasm/app_wasm.js";

  const width = 480;
  const height = 320;

  let canvas: HTMLCanvasElement;
  let fps = $state(0);
  let error = $state("");

  onMount(() => {
    let frame = 0;
    let renderer: Renderer | undefined;

    wasm()
      .then((m) => {
        renderer = new m.Renderer(width, height);
        const { memory } = m;
        const ctx = canvas.getContext("2d")!;
        let last = performance.now();
        let frames = 0;

        const draw = (now: number) => {
          renderer!.render(now / 1000);
          // Zero-copy view of the RGBA buffer in WASM memory
          const pixels = new Uint8ClampedArray(memory.buffer, renderer!.ptr(), renderer!.byteLen());
          ctx.putImageData(new ImageData(pixels, width, height), 0, 0);

          frames++;
          if (now - last >= 1000) {
            fps = Math.round((frames * 1000) / (now - last));
            frames = 0;
            last = now;
          }
          frame = requestAnimationFrame(draw);
        };
        frame = requestAnimationFrame(draw);
      })
      .catch((e) => (error = String(e)));

    return () => {
      cancelAnimationFrame(frame);
      renderer?.free();
    };
  });
</script>

<main class="mx-auto flex min-h-screen max-w-xl flex-col gap-4 p-6">
  <header class="flex items-center justify-between">
    <a href="/" class="anchor">← Back</a>
    <span class="badge preset-tonal">{fps} fps</span>
  </header>
  <p class="text-sm">
    Every pixel is computed in Rust (<code class="code">app-core::graphics</code>) compiled to WASM,
    then blitted to the canvas straight from WASM memory.
  </p>
  <canvas bind:this={canvas} {width} {height} class="w-full rounded-lg"></canvas>
  {#if error}<p class="text-error-500">{error}</p>{/if}
</main>
