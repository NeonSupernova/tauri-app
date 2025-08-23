<script lang="ts">
    import init, { run_game } from '$lib/wasm/wasm';
    import {onMount} from "svelte";
    let output: string = "";
    onMount(async () => {
        await init();
        output = run_game();
    });
</script>

<canvas id="gameCanvas"></canvas>
<p>{output}</p>
