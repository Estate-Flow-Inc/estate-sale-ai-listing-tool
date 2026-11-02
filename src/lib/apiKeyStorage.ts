import type { ProviderId } from '@/config/models';

/** API keys live in sessionStorage: this tab only, gone when it closes. */
const storageKey = (provider: ProviderId) => `estate-sale-ai-listing-tool:key:${provider}`;

export function getApiKey(provider: ProviderId): string {
  try {
    return sessionStorage.getItem(storageKey(provider)) ?? '';
  } catch {
    return '';
  }
}

export function setApiKey(provider: ProviderId, key: string) {
  try {
    sessionStorage.setItem(storageKey(provider), key);
  } catch {
    // Storage blocked: the key still works for this page load.
  }
}

/**
 * This tool shares joinestateflow.com's origin, so clear keys when the page is
 * left or closed. Other pages on the domain never see them in this tab.
 */
export function clearKeysOnLeave(providers: ProviderId[]) {
  window.addEventListener('pagehide', () => providers.forEach(clearApiKey));
}

export function clearApiKey(provider: ProviderId) {
  try {
    sessionStorage.removeItem(storageKey(provider));
  } catch {
    // Nothing to clear.
  }
}
