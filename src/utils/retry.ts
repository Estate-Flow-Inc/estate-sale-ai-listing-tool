import { ProviderError } from '@/providers/errors';

/**
 * Retry rate limits, server errors and network blips with backoff.
 * Auth, quota and bad requests fail straight away: retrying won't fix them.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  { retries = 3, signal }: { retries?: number; signal?: AbortSignal } = {}
): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const retryable = err instanceof ProviderError && err.retryable;
      if (!retryable || attempt >= retries || signal?.aborted) throw err;
      const waitSeconds = err.retryAfter ?? 2 ** attempt + Math.random();
      await new Promise((resolve) => setTimeout(resolve, waitSeconds * 1000));
    }
  }
}
