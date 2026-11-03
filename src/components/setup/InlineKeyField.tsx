import { Loader2, Lock } from 'lucide-react';
import { useState } from 'react';

import { ExternalLink } from '@/components/common/ExternalLink';
import { Button } from '@/components/ui/button';
import type { ProviderId } from '@/config/models';
import { WIZARD } from '@/constants/copy';
import { setApiKey } from '@/lib/apiKeyStorage';
import { getProvider, ProviderError } from '@/providers';

/** Shown on the page when no key is saved yet. The wizard's key step still works too. */
export function InlineKeyField({ providerId, onSaved }: { providerId: ProviderId; onSaved: () => void }) {
  const provider = getProvider(providerId);
  const [key, setKey] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    const trimmed = key.trim();
    if (!trimmed) return;
    setChecking(true);
    setError(null);
    try {
      await provider.checkKey(trimmed);
      setApiKey(providerId, trimmed);
      onSaved();
    } catch (err) {
      setError(
        err instanceof ProviderError && err.kind === 'network' ? WIZARD.key.unreachable : WIZARD.key.invalid
      );
    } finally {
      setChecking(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor="inline-api-key" className="text-sm font-medium">
          {WIZARD.key.inlineLabel}
        </label>
        <ExternalLink href={provider.keyUrl} className="text-[13px] text-accent-ink hover:underline">
          {WIZARD.key.getKey}
        </ExternalLink>
      </div>
      <div className="flex gap-2">
        <input
          id="inline-api-key"
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder={provider.keyPlaceholder}
          autoComplete="off"
          spellCheck={false}
          aria-invalid={Boolean(error)}
          aria-describedby="inline-api-key-note"
          className="h-11 min-w-0 flex-1 rounded-lg border border-input bg-warm-bg px-3.5 font-mono text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive"
        />
        <Button type="submit" variant="outline" className="h-11 px-3.5" disabled={!key.trim() || checking}>
          {checking && <Loader2 className="animate-spin" aria-hidden="true" />}
          {checking ? WIZARD.key.checking : WIZARD.key.save}
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-[13px] text-danger-ink">
          {error}
        </p>
      )}
      <p id="inline-api-key-note" className="flex items-start gap-2 text-[13px] text-muted-foreground">
        <Lock className="mt-0.5 size-3.5 flex-none" aria-hidden="true" />
        {WIZARD.key.note}
      </p>
    </form>
  );
}
