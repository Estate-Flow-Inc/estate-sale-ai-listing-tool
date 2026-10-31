export type ProviderErrorKind =
  | 'auth' // bad or revoked key
  | 'quota' // out of credit / billing issue
  | 'rate_limit'
  | 'server'
  | 'network'
  | 'bad_request'
  | 'bad_response';

const RETRYABLE: ProviderErrorKind[] = ['rate_limit', 'server', 'network'];

/** One error type for every provider, so the UI can react the same way. */
export class ProviderError extends Error {
  readonly kind: ProviderErrorKind;
  /** Seconds the provider asked us to wait, if any. */
  readonly retryAfter?: number;

  constructor(kind: ProviderErrorKind, message: string, retryAfter?: number) {
    super(message);
    this.name = 'ProviderError';
    this.kind = kind;
    this.retryAfter = retryAfter;
  }

  get retryable() {
    return RETRYABLE.includes(this.kind);
  }
}
