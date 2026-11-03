import { ProviderError, type ProviderErrorKind } from '@/providers/errors';

/** How many times to retry each kind of temporary failure. */
const MAX_RETRIES: Partial<Record<ProviderErrorKind, number>> = {
  server: 4, // overloaded (503): 2 + 4 + 8 + 16 = about 30 seconds
  rate_limit: 6,
  network: 3,
};

/** Longest single wait between tries, in seconds. */
const MAX_WAIT = 30;

/**
 * Retry temporary failures with backoff: 2s, 4s, 8s, 16s, then 30s.
 * Auth, quota and bad requests fail straight away: retrying won't fix them.
 * `onRetry` fires before each wait, so the UI can show "busy, retrying".
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  {
    signal,
    onRetry,
    serverRetries,
  }: {
    signal?: AbortSignal;
    onRetry?: (err: ProviderError, attempt: number) => void;
    /** Override retries for overload (503), e.g. when another model can take over. */
    serverRetries?: number;
  } = {}
): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (!(err instanceof ProviderError) || !err.retryable || signal?.aborted) throw err;
      const max = err.kind === 'server' && serverRetries !== undefined ? serverRetries : MAX_RETRIES[err.kind];
      if (attempt >= (max ?? 0)) throw err;
      onRetry?.(err, attempt);
      const backoff = Math.min(2 ** (attempt + 1), MAX_WAIT) + Math.random();
      const waitSeconds = Math.min(err.retryAfter ?? backoff, MAX_WAIT * 2);
      await new Promise((resolve) => setTimeout(resolve, waitSeconds * 1000));
    }
  }
}
