<script lang="ts">
  import init, { run_game } from "#lib/wasm/wasm.js";
  import { onMount } from "svelte";

  let output = $state("Loading WASM…");

  onMount(async () => {
    await init();
    output = run_game();
  });
</script>

<main class="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4 p-6">
  <a href="/" class="anchor self-start">← Back</a>
  <canvas id="gameCanvas" class="card w-full border border-surface-200-800"></canvas>
  <p>{output}</p>
</main>
