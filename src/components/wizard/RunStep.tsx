import { CircleAlert, Coffee } from 'lucide-react';
import { useEffect, useState } from 'react';

import { DailyLimitNotice } from '@/components/common/DailyLimitNotice';
import { Button } from '@/components/ui/button';
import { FREE_TIER_RPM, GENERATION_CONCURRENCY } from '@/config/limits';
import { MODELS } from '@/config/models';
import { WIZARD } from '@/constants/copy';
import { formatUsd } from '@/lib/format';
import { useListingStore, type ListingItem } from '@/store/listingStore';
import { costFromUsage } from '@/utils/costEstimator';

/** Seconds per listing before we have real numbers: free-tier pace or typical response time. */
const GUESS_SECONDS_PER_ITEM = Math.max(60 / (FREE_TIER_RPM * MODELS.length), 8 / GENERATION_CONCURRENCY);

/** Minutes left: from this run's actual pace once a few are done, else a guess. */
function minutesLeft(items: ListingItem[], startedAt: number | null, runTotal: number) {
  const remaining = items.filter((i) => i.status === 'queued' || i.status === 'generating').length;
  const finished = runTotal - remaining;
  const elapsed = startedAt ? Date.now() - startedAt : 0;
  const seconds =
    finished >= 3 && elapsed > 0
      ? (remaining * elapsed) / finished / 1000
      : remaining * GUESS_SECONDS_PER_ITEM;
  return Math.ceil(seconds / 60);
}

/** Live progress while listings are written. */
export function RunStep({ onView, onFixKey }: { onView: () => void; onFixKey: () => void }) {
  const { items, running, runStartedAt, runTotal, modelId, fatalError, dailyLimitHit, paced } =
    useListingStore();

  // Refresh the estimate even when nothing finishes for a while.
  const [, tick] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => tick((n) => n + 1), 15_000);
    return () => clearInterval(id);
  }, [running]);

  const total = items.length;
  const done = items.filter((i) => i.status === 'done').length;
  const failed = items.filter((i) => i.status === 'error').length;
  const busy = items.some((i) => i.busy);
  // Each listing is priced by the model that actually wrote it.
  const spent = items.reduce(
    (sum, i) => sum + (i.usage ? costFromUsage(i.modelId ?? modelId ?? '', i.usage) : 0),
    0
  );
  const pct = total ? Math.round(((done + failed) / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">{running ? WIZARD.run.progress(done, total) : WIZARD.run.done}</span>
          <span className="font-mono text-muted-foreground">{WIZARD.run.spent(formatUsd(spent))}</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-2 overflow-hidden rounded-full bg-muted"
        >
          <div className="h-full bg-accent-warm transition-[width] duration-300" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between gap-3 text-[13px]">
          <span className="text-muted-foreground">
            {running && WIZARD.run.eta(minutesLeft(items, runStartedAt, runTotal))}
          </span>
          {failed > 0 && <span className="text-danger-ink">{WIZARD.run.failed(failed)}</span>}
        </div>
      </div>

      {running && (
        <div className="flex items-start gap-3 rounded-xl border border-border bg-warm-bg p-4">
          <Coffee className="mt-0.5 size-5 flex-none text-accent-ink" aria-hidden="true" />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">{WIZARD.run.awayTitle}</p>
            <p className="text-[13px] text-muted-foreground">{WIZARD.run.away}</p>
          </div>
        </div>
      )}

      {dailyLimitHit && <DailyLimitNotice />}
      {fatalError && !dailyLimitHit && (
        <div role="alert" className="flex items-start gap-2 rounded-lg bg-[#f7e4e0] p-3 text-sm text-danger-ink">
          <CircleAlert className="mt-0.5 size-4 flex-none" aria-hidden="true" />
          <span>{fatalError}</span>
        </div>
      )}

      {paced && running && (
        <p role="status" className="rounded-lg bg-muted px-3 py-2 text-[13px]">
          {WIZARD.run.paced}
        </p>
      )}
      {busy && !paced && (
        <p role="status" className="rounded-lg bg-muted px-3 py-2 text-[13px]">
          {WIZARD.run.busy}
        </p>
      )}

      <div className="flex justify-end gap-2">
        {fatalError && !dailyLimitHit && !running && (
          <Button variant="outline" size="xl" onClick={onFixKey}>
            {WIZARD.run.fixKey}
          </Button>
        )}
        <Button size="xl" onClick={onView}>
          {WIZARD.run.view}
        </Button>
      </div>
    </div>
  );
}
