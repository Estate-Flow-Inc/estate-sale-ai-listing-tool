import { useSyncExternalStore } from 'react';

import type { ProviderId } from '@/config/models';
import { getApiKey, subscribeApiKey } from '@/lib/apiKeyStorage';

/** The saved key for a provider, re-rendering when it's saved or removed. */
export function useApiKey(provider: ProviderId) {
  return useSyncExternalStore(
    subscribeApiKey,
    () => getApiKey(provider),
    () => ''
  );
}
