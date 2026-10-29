import { invoke } from '@tauri-apps/api/core';

export type AvailableUpdate = {
  version: string;
  notes: string | null;
};

export async function checkForUpdates(): Promise<AvailableUpdate | null> {
  return invoke<AvailableUpdate | null>('check_for_updates');
}

export async function installUpdate(version: string): Promise<void> {
  await invoke('install_update', { expectedVersion: version });
}
