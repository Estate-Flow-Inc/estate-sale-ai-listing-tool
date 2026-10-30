import { useSyncExternalStore } from 'react';

import { getSettings, subscribeSettings, updateSettings } from '@/lib/settings';

/** Current settings plus an updater. Every component using this stays in sync. */
export function useSettings() {
  const settings = useSyncExternalStore(subscribeSettings, getSettings);
  return [settings, updateSettings] as const;
}
