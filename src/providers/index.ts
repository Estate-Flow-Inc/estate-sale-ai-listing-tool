import type { ProviderId } from '@/config/models';

import { openaiProvider } from './openai';
import type { Provider } from './types';

/** Live providers. Anthropic and Gemini get added here when their files exist. */
export const PROVIDERS: Partial<Record<ProviderId, Provider>> = {
  openai: openaiProvider,
};

/** Shown in the picker, in order. Ones not in PROVIDERS show as "Coming soon". */
export const PROVIDER_ORDER: { id: ProviderId; label: string }[] = [
  { id: 'openai', label: 'OpenAI' },
  { id: 'anthropic', label: 'Anthropic' },
  { id: 'gemini', label: 'Google Gemini' },
];

export function getProvider(id: ProviderId): Provider {
  const provider = PROVIDERS[id];
  if (!provider) throw new Error(`Provider ${id} is not available yet`);
  return provider;
}

export { ProviderError } from './errors';
export type { Listing } from './listingSchema';
export type { TokenUsage } from './types';
