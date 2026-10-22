<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";

  let name = $state("");
  let greetMsg = $state("");
  let error = $state("");

  async function greet(event: Event) {
    event.preventDefault();
    error = "";
    try {
      // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
      greetMsg = await invoke<string>("greet", { name });
    } catch (e) {
      // `invoke` rejects when running outside the Tauri webview (e.g. plain `bun run dev`)
      greetMsg = "";
      error = String(e);
    }
  }
</script>

<main class="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
  <h1 class="h1">Welcome to Tauri + Svelte</h1>

  <div class="flex items-center justify-center gap-4">
    <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
      <img src="/vite.svg" class="logo hover:drop-shadow-[0_0_2em_#747bff]" alt="Vite Logo" />
    </a>
    <a href="https://tauri.app" target="_blank" rel="noreferrer">
      <img src="/tauri.svg" class="logo hover:drop-shadow-[0_0_2em_#24c8db]" alt="Tauri Logo" />
    </a>
    <a href="https://kit.svelte.dev" target="_blank" rel="noreferrer">
      <img src="/svelte.svg" class="logo hover:drop-shadow-[0_0_2em_#ff3e00]" alt="SvelteKit Logo" />
    </a>
  </div>
  <p>Click on the Tauri, Vite, and SvelteKit logos to learn more.</p>

  <form class="flex w-full max-w-md gap-2" onsubmit={greet}>
    <input class="input" placeholder="Enter a name..." bind:value={name} />
    <button type="submit" class="btn preset-filled-primary-500" disabled={!name.trim()}>Greet</button>
  </form>
  {#if greetMsg}<p>{greetMsg}</p>{/if}
  {#if error}<p class="text-error-500">{error}</p>{/if}

  <a href="/test" class="anchor">WASM test page →</a>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 0.75s;
  }
</style>
