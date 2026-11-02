import { useSyncExternalStore } from 'react';

import { getSettings, subscribeSettings, updateSettings } from '@/lib/settings';

/** Current settings plus an updater. Every component using this stays in sync. */
export function useSettings() {
  // Third arg: the pre-render (no browser storage) uses the same defaults.
  const settings = useSyncExternalStore(subscribeSettings, getSettings, getSettings);
  return [settings, updateSettings] as const;
}
