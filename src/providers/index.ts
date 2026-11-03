import type { ProviderId } from '@/config/models';

import { geminiProvider } from './gemini';
import type { Provider } from './types';

/** The AI provider this tool uses. One file per provider in src/providers/. */
export const PROVIDERS: Record<ProviderId, Provider> = {
  gemini: geminiProvider,
};

export const PROVIDER_IDS = Object.keys(PROVIDERS) as ProviderId[];

export function getProvider(id: ProviderId): Provider {
  return PROVIDERS[id];
}

export { ProviderError } from './errors';
export type { Listing } from './listingSchema';
export type { TokenUsage } from './types';
