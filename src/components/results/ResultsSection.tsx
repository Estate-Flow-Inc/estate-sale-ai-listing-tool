import { X } from 'lucide-react';
import { useState } from 'react';

import { Container } from '@/components/common/Container';
import { DailyLimitNotice } from '@/components/common/DailyLimitNotice';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { KeyStep } from '@/components/wizard/KeyStep';
import { getModel } from '@/config/models';
import { RESULTS_PAGE_SIZE } from '@/config/limits';
import { DISCLAIMER, RESULTS, WIZARD } from '@/constants/copy';
import { useSettings } from '@/hooks/useSettings';
import { useApiKey } from '@/hooks/useApiKey';
import { formatUsd } from '@/lib/format';
import { useListingStore } from '@/store/listingStore';
import { startOver } from '@/store/persist';
import { costFromUsage, estimateCost } from '@/utils/costEstimator';

import { ExportPanel } from './ExportPanel';
import { ItemCard } from './ItemCard';
import { ItemDetail } from './ItemDetail';

/** Grid of generated listings with actual spend vs estimate. */
export function ResultsSection() {
  const { items, running, modelId, retry, dailyLimitHit } = useListingStore();
  const [settings] = useSettings();
  const runModel = modelId ?? settings.modelId;
  const apiKey = useApiKey(getModel(runModel).provider);
  const [openId, setOpenId] = useState<string | null>(null);
  const [shown, setShown] = useState(RESULTS_PAGE_SIZE);
  const [keyOpen, setKeyOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (items.length === 0) return null;

  const done = items.filter((i) => i.status === 'done');
  const retryable = items.some((i) => i.status === 'error' || i.status === 'queued');
  const unfinished = items.some((i) => i.status === 'queued');

  // After a refresh the key is gone (on purpose): ask for it, then carry on.
  const continueRun = () => {
    if (apiKey) retry({ apiKey, modelId: runModel });
    else setKeyOpen(true);
  };


  const spent = done.reduce(
    (sum, i) => sum + (i.usage ? costFromUsage(i.modelId ?? runModel, i.usage) : 0),
    0
  );
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
            <p className="text-[13px] text-muted-foreground">{RESULTS.saved}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {!running && (
              <Button variant="ghost" size="xl" onClick={() => setConfirmOpen(true)}>
                {RESULTS.startOver}
              </Button>
            )}
            {retryable && !running && (
              <Button variant="outline" size="xl" onClick={continueRun}>
                {unfinished ? RESULTS.resume : RESULTS.retry}
              </Button>
            )}
          </div>
        </div>

        {dailyLimitHit && <DailyLimitNotice />}
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

        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent className="max-w-md">
            <DialogTitle className="font-serif text-2xl">{RESULTS.startOverTitle}</DialogTitle>
            <DialogDescription className="mt-2 text-sm text-muted-foreground">{RESULTS.startOverBody}</DialogDescription>
            <div className="mt-6 flex justify-end gap-2">
              <DialogClose render={<Button variant="outline" size="xl" />}>{RESULTS.cancel}</DialogClose>
              <Button
                variant="destructive"
                size="xl"
                onClick={() => {
                  setConfirmOpen(false);
                  void startOver();
                }}
              >
                {RESULTS.startOverConfirm}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {keyOpen && (
          <Dialog open onOpenChange={setKeyOpen}>
            <DialogContent>
              <div className="mb-5 flex items-start justify-between gap-4">
                <DialogTitle className="font-serif text-2xl">{WIZARD.steps.key}</DialogTitle>
                <DialogClose
                  aria-label={WIZARD.close}
                  className="-mt-1 -mr-2 flex size-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
                >
                  <X className="size-5" aria-hidden="true" />
                </DialogClose>
              </div>
              <KeyStep
                providerId={getModel(runModel).provider}
                initialKey=""
                onDone={(key) => {
                  setKeyOpen(false);
                  retry({ apiKey: key, modelId: runModel });
                }}
              />
            </DialogContent>
          </Dialog>
        )}

        <ItemDetail key={openId} item={items.find((i) => i.id === openId) ?? null} onClose={() => setOpenId(null)} />
      </Container>
    </section>
  );
}
