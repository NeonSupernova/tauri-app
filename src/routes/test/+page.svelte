<script lang="ts">
  import init, { run_game } from "$lib/wasm/wasm";
  import { onMount } from "svelte";

  let output = $state("Loading WASM…");

  onMount(async () => {
    try {
      await init();
      output = run_game();
    } catch (e) {
      output = `Failed to load WASM module: ${e}`;
    }
  });
</script>

<main class="flex flex-col items-center gap-4 p-8">
  <a href="/" class="anchor self-start">← Back</a>
  <canvas id="gameCanvas" class="border border-surface-500"></canvas>
  <p>{output}</p>
</main>
