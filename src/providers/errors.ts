export type ProviderErrorKind =
  | 'auth' // bad or revoked key
  | 'quota' // out of credit, or the free tier's daily limit
  | 'rate_limit'
  | 'server'
  | 'network'
  | 'unavailable' // model overloaded for good or not found: try another model
  | 'bad_request'
  | 'bad_response';

const RETRYABLE: ProviderErrorKind[] = ['rate_limit', 'server', 'network'];

/** One error type for every provider, so the UI can react the same way. */
export class ProviderError extends Error {
  readonly kind: ProviderErrorKind;
  /** Seconds the provider asked us to wait, if any. */
  readonly retryAfter?: number;
  /** HTTP status and raw provider message, for debugging. */
  readonly status?: number;
  readonly detail?: string;

  constructor(
    kind: ProviderErrorKind,
    message: string,
    retryAfter?: number,
    debug?: { status?: number; detail?: string }
  ) {
    super(message);
    this.name = 'ProviderError';
    this.kind = kind;
    this.retryAfter = retryAfter;
    this.status = debug?.status;
    this.detail = debug?.detail;
  }

  get retryable() {
    return RETRYABLE.includes(this.kind);
  }
}
