<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";

  let name = $state("");
  let greetMsg = $state("");
  let error = $state("");

  const logos = [
    { href: "https://vite.dev", src: "/vite.svg", alt: "Vite logo", glow: "hover:drop-shadow-[0_0_2em_#747bff]" },
    { href: "https://tauri.app", src: "/tauri.svg", alt: "Tauri logo", glow: "hover:drop-shadow-[0_0_2em_#24c8db]" },
    { href: "https://svelte.dev/docs/kit", src: "/svelte.svg", alt: "SvelteKit logo", glow: "hover:drop-shadow-[0_0_2em_#ff3e00]" },
  ];

  async function greet(event: SubmitEvent) {
    event.preventDefault();
    error = "";
    try {
      // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
      greetMsg = await invoke<string>("greet", { name });
    } catch (e) {
      greetMsg = "";
      error = String(e);
    }
  }
</script>

<main class="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-6 p-6 text-center">
  <h1 class="h1">Welcome to Tauri + Svelte</h1>

  <div class="flex justify-center">
    {#each logos as logo (logo.href)}
      <a href={logo.href} target="_blank" rel="noreferrer">
        <img src={logo.src} alt={logo.alt} class="h-24 p-6 transition duration-700 {logo.glow}" />
      </a>
    {/each}
  </div>
  <p>Click on the Tauri, Vite, and SvelteKit logos to learn more.</p>

  <form class="flex w-full gap-2" onsubmit={greet}>
    <input class="input" placeholder="Enter a name..." bind:value={name} />
    <button type="submit" class="btn preset-filled-primary-500">Greet</button>
  </form>
  {#if greetMsg}<p>{greetMsg}</p>{/if}
  {#if error}<p class="text-error-500">{error}</p>{/if}

  <a href="/test" class="anchor">WASM test page →</a>
</main>
