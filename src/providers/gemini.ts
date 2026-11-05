import { GEMINI_API_KEYS_URL } from '@/config/constants';
import { REQUEST_TIMEOUT_MS } from '@/config/limits';
import { getModel } from '@/config/models';
import type { ImageQuality } from '@/config/settings';
import { buildListingUserPrompt, LISTING_SYSTEM_PROMPT } from '@/constants/prompts';

import { ProviderError } from './errors';
import { LISTING_JSON_SCHEMA, parseListing } from './listingSchema';
import type { Provider } from './types';

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

/** Room for a full listing plus a little thinking. */
const MAX_OUTPUT_TOKENS = 4096;

/** Gemini bills images by resolution tier, not pixels (see config/estimates.ts). */
const MEDIA_RESOLUTION: Record<ImageQuality, string> = {
  small: 'MEDIA_RESOLUTION_MEDIUM',
  balanced: 'MEDIA_RESOLUTION_MEDIUM', // plenty to identify an item, half the tokens, faster
  detailed: 'MEDIA_RESOLUTION_HIGH',
};

/** Finish reasons that mean Google declined to answer. */
const BLOCKED = ['SAFETY', 'PROHIBITED_CONTENT', 'BLOCKLIST', 'SPII', 'IMAGE_SAFETY', 'RECITATION'];

function headers(apiKey: string) {
  return { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' };
}

async function request(url: string, init: RequestInit) {
  // Cap every request; the caller's signal (Stop) still cancels immediately.
  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  const signal = init.signal ? AbortSignal.any([init.signal, timeout]) : timeout;
  try {
    return await fetch(url, { ...init, signal });
  } catch (err) {
    // Timed out with no response: treat like an overload so it's retried with backoff.
    if (timeout.aborted && !init.signal?.aborted) {
      throw new ProviderError('server', 'Google is seeing high demand. Try again in a few minutes.', undefined, {
        status: 0,
        detail: `No response after ${REQUEST_TIMEOUT_MS / 1000}s (timed out)`,
      });
    }
    if (err instanceof DOMException && err.name === 'AbortError') throw err;
    throw new ProviderError('network', "Couldn't reach Google Gemini");
  }
}

interface GoogleErrorDetail {
  '@type'?: string;
  reason?: string;
  retryDelay?: string;
  violations?: { quotaId?: string }[];
}

async function toProviderError(res: Response): Promise<ProviderError> {
  let raw = '';
  let body: { error?: { message?: string; status?: string; details?: GoogleErrorDetail[] } } = {};
  try {
    body = await res.json();
    raw = `${res.status} ${body.error?.status ?? ''}: ${body.error?.message ?? ''}`;
  } catch {
    raw = `${res.status}: (no JSON body)`;
  }
  const err = classify(res, body);
  return new ProviderError(err.kind, err.message, err.retryAfter, { status: res.status, detail: raw });
}

function classify(
  res: Response,
  body: { error?: { message?: string; details?: GoogleErrorDetail[] } }
): ProviderError {
  const message = body.error?.message ?? `Gemini returned ${res.status}`;
  const details = body.error?.details ?? [];

  const badKey =
    res.status === 401 ||
    res.status === 403 ||
    details.some((d) => d.reason === 'API_KEY_INVALID') ||
    /api key/i.test(message);
  if (badKey) return new ProviderError('auth', "Google didn't accept this API key.");

  if (res.status === 429) {
    const daily = details.some((d) => d.violations?.some((v) => /PerDay/i.test(v.quotaId ?? '')));
    if (daily) {
      return new ProviderError(
        'quota',
        "You've hit Google's free limit of 500 listings a day. Try again tomorrow, or turn on billing in Google AI Studio."
      );
    }
    const delay = details.find((d) => d.retryDelay)?.retryDelay;
    return new ProviderError('rate_limit', message, delay ? parseFloat(delay) : undefined);
  }
  if (res.status === 503) {
    // Overloaded. Retried automatically; this text shows only if every retry fails.
    return new ProviderError('server', 'Google is seeing high demand. Try again in a few minutes.');
  }
  if (res.status === 404) return new ProviderError('unavailable', message);
  // This model can't do part of the request (images, thinking level, JSON schema):
  // let the next model try. Other 400s are our bug and shouldn't rotate.
  if (res.status === 400 && /not supported|unsupported|not enabled|is not available/i.test(message)) {
    return new ProviderError('unavailable', message);
  }
  if (res.status >= 500) return new ProviderError('server', message);
  return new ProviderError('bad_request', message);
}

interface GenerateResponse {
  promptFeedback?: { blockReason?: string };
  candidates?: {
    finishReason?: string;
    content?: { parts?: { text?: string; thought?: boolean }[] };
  }[];
  usageMetadata?: {
    promptTokenCount?: number;
    cachedContentTokenCount?: number;
    candidatesTokenCount?: number;
    thoughtsTokenCount?: number;
  };
}

function extractText(data: GenerateResponse): string {
  if (data.promptFeedback?.blockReason) {
    throw new ProviderError('bad_response', 'Google declined to describe this photo');
  }
  const candidate = data.candidates?.[0];
  if (candidate?.finishReason && BLOCKED.includes(candidate.finishReason)) {
    throw new ProviderError('bad_response', 'Google declined to describe this photo');
  }
  const text = (candidate?.content?.parts ?? [])
    .filter((p) => !p.thought && p.text)
    .map((p) => p.text)
    .join('');
  if (!text || candidate?.finishReason === 'MAX_TOKENS') {
    throw new ProviderError('bad_response', 'The model returned an incomplete listing');
  }
  return text;
}

/** `data:image/jpeg;base64,...` to Gemini's inline image part. */
function toInlineImage(dataUrl: string) {
  const [meta, data] = dataUrl.split(',');
  const mimeType = meta.match(/data:(.*?);/)?.[1] ?? 'image/jpeg';
  return { inlineData: { mimeType, data } };
}

export const geminiProvider: Provider = {
  id: 'gemini',
  label: 'Google Gemini',
  keyUrl: GEMINI_API_KEYS_URL,
  keyPlaceholder: 'AIza...',

  async checkKey(apiKey, signal) {
    const res = await request(`${BASE_URL}/models?pageSize=1`, { headers: headers(apiKey), signal });
    if (!res.ok) throw await toProviderError(res);
  },

  async generateListing({ apiKey, modelId, images, imageQuality, signal }) {
    const model = getModel(modelId);
    const res = await request(`${BASE_URL}/models/${model.id}:generateContent`, {
      method: 'POST',
      headers: headers(apiKey),
      signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: LISTING_SYSTEM_PROMPT }] },
        contents: [
          {
            role: 'user',
            // Photos first, then the instruction (the last user part must be text).
            parts: [...images.map(toInlineImage), { text: buildListingUserPrompt(images.length) }],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          responseJsonSchema: LISTING_JSON_SCHEMA,
          // Lowest thinking the model allows: thinking tokens bill as output.
          thinkingConfig: { thinkingLevel: model.thinkingLevel },
          mediaResolution: MEDIA_RESOLUTION[imageQuality],
          maxOutputTokens: MAX_OUTPUT_TOKENS,
        },
      }),
    });
    if (!res.ok) throw await toProviderError(res);

    const data = (await res.json()) as GenerateResponse;
    let listing;
    try {
      listing = parseListing(extractText(data));
    } catch (err) {
      if (err instanceof ProviderError) throw err;
      throw new ProviderError('bad_response', 'The model returned an unreadable listing');
    }

    const u = data.usageMetadata ?? {};
    return {
      listing,
      usage: {
        inputTokens: u.promptTokenCount ?? 0,
        cachedInputTokens: u.cachedContentTokenCount ?? 0,
        outputTokens: (u.candidatesTokenCount ?? 0) + (u.thoughtsTokenCount ?? 0),
      },
    };
  },
};
