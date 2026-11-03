import type { ProviderId } from '@/config/models';
import type { ImageQuality } from '@/config/settings';

import type { Listing } from './listingSchema';

export interface TokenUsage {
  /** All input tokens, including cached ones. */
  inputTokens: number;
  /** The part of inputTokens billed at the cached rate. */
  cachedInputTokens: number;
  /** Everything billed as output, including thinking tokens. */
  outputTokens: number;
}

export interface GenerateListingInput {
  apiKey: string;
  modelId: string;
  /** `data:image/jpeg;base64,...` URLs, all of the same item. */
  images: string[];
  /** The photo size setting, which also sets the provider's image detail. */
  imageQuality: ImageQuality;
  signal?: AbortSignal;
}

export interface GenerateListingResult {
  listing: Listing;
  usage: TokenUsage;
}

/** Every AI provider implements this. Add one file per provider in src/providers/. */
export interface Provider {
  id: ProviderId;
  label: string;
  /** Where to create an API key. */
  keyUrl: string;
  keyPlaceholder: string;
  /** Cheap call to confirm the key works before spending anything. */
  checkKey: (apiKey: string, signal?: AbortSignal) => Promise<void>;
  generateListing: (input: GenerateListingInput) => Promise<GenerateListingResult>;
}
