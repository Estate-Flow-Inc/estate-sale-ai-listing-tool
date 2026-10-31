import { OPENAI_API_KEYS_URL } from '@/config/constants';
import { buildListingUserPrompt, LISTING_SYSTEM_PROMPT } from '@/constants/prompts';

import { ProviderError } from './errors';
import { LISTING_JSON_SCHEMA, parseListing } from './listingSchema';
import type { Provider } from './types';

const BASE_URL = 'https://api.openai.com/v1';

/** Room for a full listing; anything longer means something went wrong. */
const MAX_OUTPUT_TOKENS = 2000;

function headers(apiKey: string) {
  return { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' };
}

async function request(url: string, init: RequestInit) {
  try {
    return await fetch(url, init);
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err;
    throw new ProviderError('network', "Couldn't reach OpenAI");
  }
}

async function toProviderError(res: Response): Promise<ProviderError> {
  let message = `OpenAI returned ${res.status}`;
  let code: string | undefined;
  try {
    const body = await res.json();
    message = body?.error?.message ?? message;
    code = body?.error?.code;
  } catch {
    // Body wasn't JSON; keep the status message.
  }
  const retryAfter = Number(res.headers.get('retry-after')) || undefined;

  if (res.status === 401 || res.status === 403) return new ProviderError('auth', message);
  if (res.status === 429) {
    return code === 'insufficient_quota'
      ? new ProviderError('quota', message)
      : new ProviderError('rate_limit', message, retryAfter);
  }
  if (res.status >= 500) return new ProviderError('server', message, retryAfter);
  return new ProviderError('bad_request', message);
}

interface ResponsesOutput {
  status?: string;
  output?: { type: string; content?: { type: string; text?: string; refusal?: string }[] }[];
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    input_tokens_details?: { cached_tokens?: number };
  };
}

function extractText(data: ResponsesOutput): string {
  const parts = (data.output ?? []).flatMap((o) => (o.type === 'message' ? (o.content ?? []) : []));
  const refusal = parts.find((p) => p.type === 'refusal');
  if (refusal) throw new ProviderError('bad_response', refusal.refusal ?? 'The model declined');
  const text = parts.find((p) => p.type === 'output_text')?.text;
  if (!text || data.status === 'incomplete') {
    throw new ProviderError('bad_response', 'The model returned an incomplete listing');
  }
  return text;
}

export const openaiProvider: Provider = {
  id: 'openai',
  label: 'OpenAI',
  keyUrl: OPENAI_API_KEYS_URL,
  keyPlaceholder: 'sk-...',

  async checkKey(apiKey, signal) {
    const res = await request(`${BASE_URL}/models`, { headers: headers(apiKey), signal });
    if (!res.ok) throw await toProviderError(res);
  },

  async generateListing({ apiKey, modelId, images, signal }) {
    const res = await request(`${BASE_URL}/responses`, {
      method: 'POST',
      headers: headers(apiKey),
      signal,
      body: JSON.stringify({
        model: modelId,
        instructions: LISTING_SYSTEM_PROMPT,
        input: [
          {
            role: 'user',
            content: [
              { type: 'input_text', text: buildListingUserPrompt(images.length) },
              ...images.map((url) => ({ type: 'input_image', image_url: url, detail: 'high' })),
            ],
          },
        ],
        text: {
          format: { type: 'json_schema', name: 'listing', schema: LISTING_JSON_SCHEMA, strict: true },
        },
        // No reasoning: a listing from a photo doesn't need it, and reasoning tokens bill as output.
        reasoning: { effort: 'none' },
        max_output_tokens: MAX_OUTPUT_TOKENS,
        // Don't keep the photos or listing on OpenAI's side.
        store: false,
      }),
    });
    if (!res.ok) throw await toProviderError(res);

    const data = (await res.json()) as ResponsesOutput;
    let listing;
    try {
      listing = parseListing(extractText(data));
    } catch (err) {
      if (err instanceof ProviderError) throw err;
      throw new ProviderError('bad_response', 'The model returned an unreadable listing');
    }

    return {
      listing,
      usage: {
        inputTokens: data.usage?.input_tokens ?? 0,
        cachedInputTokens: data.usage?.input_tokens_details?.cached_tokens ?? 0,
        outputTokens: data.usage?.output_tokens ?? 0,
      },
    };
  },
};
