<script lang="ts">
    import init, { run_game } from '$lib/wasm/wasm';
    import { onMount } from "svelte";

    let output = $state("");

    onMount(async () => {
        await init();
        output = run_game();
    });
</script>

<a href="/">Back</a>
<canvas id="gameCanvas"></canvas>
<p>{output}</p>
