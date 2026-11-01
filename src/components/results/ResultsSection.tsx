import { useState } from 'react';

import { Container } from '@/components/common/Container';
import { Button } from '@/components/ui/button';
import { getModel } from '@/config/models';
import { RESULTS_PAGE_SIZE } from '@/config/limits';
import { DISCLAIMER, RESULTS } from '@/constants/copy';
import { useSettings } from '@/hooks/useSettings';
import { getApiKey } from '@/lib/apiKeyStorage';
import { formatUsd } from '@/lib/format';
import { useListingStore } from '@/store/listingStore';
import { costFromUsage, estimateCost } from '@/utils/costEstimator';

import { ExportPanel } from './ExportPanel';
import { ItemCard } from './ItemCard';
import { ItemDetail } from './ItemDetail';

/** Grid of generated listings with actual spend vs estimate. */
export function ResultsSection() {
  const { items, running, modelId, retry } = useListingStore();
  const [settings] = useSettings();
  const [openId, setOpenId] = useState<string | null>(null);
  const [shown, setShown] = useState(RESULTS_PAGE_SIZE);

  if (items.length === 0) return null;

  const done = items.filter((i) => i.status === 'done');
  const retryable = items.some((i) => i.status === 'error' || i.status === 'queued');
  const runModel = modelId ?? settings.modelId;
  const apiKey = getApiKey(getModel(runModel).provider);

  const spent = done.reduce((sum, i) => sum + (i.usage ? costFromUsage(runModel, i.usage) : 0), 0);
  const estimated = estimateCost({
    modelId: runModel,
    itemCount: done.length,
    photoCount: done.reduce((n, i) => n + i.images.length, 0),
    imageQuality: settings.imageQuality,
  }).expected;

  return (
    <section id="results" className="scroll-mt-6">
      <Container className="flex flex-col gap-6 pb-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="font-serif text-3xl">{RESULTS.title}</h2>
            <p className="text-sm text-muted-foreground">
              {RESULTS.summary(done.length, items.length)}
              {done.length > 0 && (
                <span className="font-mono"> · {RESULTS.spent(formatUsd(spent), formatUsd(estimated))}</span>
              )}
            </p>
          </div>
          {retryable && !running && apiKey && (
            <Button variant="outline" size="xl" onClick={() => retry({ apiKey, modelId: runModel })}>
              {RESULTS.retry}
            </Button>
          )}
        </div>

        <ExportPanel items={items} />
        <p className="-mt-3 text-[13px] text-muted-foreground">{DISCLAIMER.short}</p>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.slice(0, shown).map((item) => (
            <ItemCard key={item.id} item={item} onOpen={() => setOpenId(item.id)} />
          ))}
        </ul>
        {items.length > shown && (
          <Button
            variant="outline"
            size="xl"
            className="self-center"
            onClick={() => setShown((n) => n + RESULTS_PAGE_SIZE)}
          >
            {RESULTS.showMore(Math.min(shown, items.length), items.length)}
          </Button>
        )}

        <ItemDetail key={openId} item={items.find((i) => i.id === openId) ?? null} onClose={() => setOpenId(null)} />
      </Container>
    </section>
  );
}
