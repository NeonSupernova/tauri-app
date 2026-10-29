<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { isTauri } from '@tauri-apps/api/core';
  import type { Snippet } from 'svelte';
  let { children }: { children: Snippet } = $props();
  import { checkForUpdates, installUpdate, type AvailableUpdate } from '#lib/updates.ts';

  let update = $state<AvailableUpdate | null>(null);
  let installing = $state(false);
  let error = $state('');

  onMount(() => {
    // Regular development builds and browser previews must work without
    // production signing keys or an update server.
    if (!isTauri() || import.meta.env.VITE_UPDATES_ENABLED !== 'true') return;

    void checkForUpdates()
      .then((available) => { update = available; })
      .catch((reason) => console.warn('Update check failed:', reason));
  });

  async function applyUpdate() {
    if (!update || installing) return;
    installing = true;
    error = '';
    try {
      await installUpdate(update.version);
    } catch (reason) {
      error = reason instanceof Error ? reason.message : String(reason);
      installing = false;
    }
  }
</script>

{@render children()}

{#if update}
  <aside class="fixed bottom-4 right-4 z-50 max-w-sm rounded-xl border border-surface-300-700 bg-surface-100-900 p-4 shadow-xl" role="status">
    <p class="font-semibold">Update {update.version} available</p>
    {#if update.notes}<p class="mt-1 text-sm whitespace-pre-line">{update.notes}</p>{/if}
    {#if error}<p class="mt-2 text-sm text-error-500">{error}</p>{/if}
    <div class="mt-3 flex gap-2">
      <button class="btn preset-filled-primary-500" disabled={installing} onclick={applyUpdate}>
        {installing ? 'Installing…' : 'Install and restart'}
      </button>
      <button class="btn preset-tonal" disabled={installing} onclick={() => { update = null; }}>Later</button>
    </div>
  </aside>
{/if}
