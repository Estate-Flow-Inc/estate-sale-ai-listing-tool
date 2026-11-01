import { Loader2, Lock } from 'lucide-react';
import { useState } from 'react';

import { ExternalLink } from '@/components/common/ExternalLink';
import { Button } from '@/components/ui/button';
import { WALKTHROUGH_YOUTUBE_URL } from '@/config/constants';
import type { ProviderId } from '@/config/models';
import { WIZARD } from '@/constants/copy';
import { clearApiKey, setApiKey } from '@/lib/apiKeyStorage';
import { cn } from '@/lib/utils';
import { getProvider, PROVIDER_ORDER, PROVIDERS, ProviderError } from '@/providers';

/** Pick a provider and paste a key. The key is checked before moving on. */
export function KeyStep({
  providerId,
  initialKey,
  onDone,
}: {
  providerId: ProviderId;
  initialKey: string;
  onDone: (key: string) => void;
}) {
  const provider = getProvider(providerId);
  const [key, setKey] = useState(initialKey);
  const [visible, setVisible] = useState(false);
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
      onDone(trimmed);
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
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
    >
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium">{WIZARD.key.providerLabel}</legend>
        <div className="grid grid-cols-3 gap-2">
          {PROVIDER_ORDER.map((p) => {
            const live = Boolean(PROVIDERS[p.id]);
            const selected = p.id === providerId;
            return (
              <div
                key={p.id}
                aria-disabled={!live}
                className={cn(
                  'flex flex-col gap-0.5 rounded-lg border p-3 text-sm',
                  selected ? 'border-[1.5px] border-accent-warm bg-[#faf7f2]' : 'border-border',
                  !live && 'opacity-60'
                )}
              >
                <span className="font-medium">{p.label}</span>
                {!live && <span className="text-xs text-muted-foreground">{WIZARD.key.comingSoon}</span>}
              </div>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor="api-key" className="text-sm font-medium">
            {provider.label} {WIZARD.key.label}
          </label>
          <span className="flex gap-3 text-[13px]">
            {initialKey && key === initialKey && (
              <button
                type="button"
                onClick={() => {
                  clearApiKey(providerId);
                  setKey('');
                }}
                className="text-muted-foreground hover:text-foreground hover:underline"
              >
                {WIZARD.key.remove}
              </button>
            )}
            <ExternalLink href={provider.keyUrl} className="text-accent-ink hover:underline">
              {WIZARD.key.getKey}
            </ExternalLink>
          </span>
        </div>
        <div className="flex gap-2">
          <input
            id="api-key"
            type={visible ? 'text' : 'password'}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder={provider.keyPlaceholder}
            autoComplete="off"
            spellCheck={false}
            aria-invalid={Boolean(error)}
            aria-describedby="api-key-note"
            className="h-11 min-w-0 flex-1 rounded-lg border border-input bg-warm-bg px-3.5 font-mono text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive"
          />
          <Button type="button" variant="outline" className="h-11 px-3.5" onClick={() => setVisible((v) => !v)}>
            {visible ? WIZARD.key.hide : WIZARD.key.show}
          </Button>
        </div>
        {error && (
          <p role="alert" className="text-[13px] text-danger-ink">
            {error}
          </p>
        )}
        <p id="api-key-note" className="flex items-start gap-2 text-[13px] text-muted-foreground">
          <Lock className="mt-0.5 size-3.5 flex-none" aria-hidden="true" />
          {WIZARD.key.note}
        </p>
        {WALKTHROUGH_YOUTUBE_URL && (
          <p className="text-[13px] text-muted-foreground">
            {WIZARD.key.help}{' '}
            <ExternalLink href={WALKTHROUGH_YOUTUBE_URL} className="font-medium text-accent-ink hover:underline">
              {WIZARD.key.watch}
            </ExternalLink>
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="xl" disabled={!key.trim() || checking}>
          {checking && <Loader2 className="animate-spin" aria-hidden="true" />}
          {checking ? WIZARD.key.checking : WIZARD.next}
        </Button>
      </div>
    </form>
  );
}
