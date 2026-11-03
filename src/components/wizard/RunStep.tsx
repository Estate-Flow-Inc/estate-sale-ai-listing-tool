import { CircleAlert } from 'lucide-react';

import { DailyLimitNotice } from '@/components/common/DailyLimitNotice';
import { Button } from '@/components/ui/button';
import { FREE_TIER_RPM } from '@/config/limits';
import { MODELS } from '@/config/models';
import { WIZARD } from '@/constants/copy';
import { formatUsd } from '@/lib/format';
import { useListingStore } from '@/store/listingStore';
import { costFromUsage } from '@/utils/costEstimator';

/** Live progress while listings are written. */
export function RunStep({ onView, onFixKey }: { onView: () => void; onFixKey: () => void }) {
  const { items, running, modelId, fatalError, dailyLimitHit, paced, stop } = useListingStore();

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
        {failed > 0 && <span className="text-[13px] text-danger-ink">{WIZARD.run.failed(failed)}</span>}
      </div>

      {dailyLimitHit && <DailyLimitNotice />}
      {fatalError && !dailyLimitHit && (
        <div role="alert" className="flex items-start gap-2 rounded-lg bg-[#f7e4e0] p-3 text-sm text-danger-ink">
          <CircleAlert className="mt-0.5 size-4 flex-none" aria-hidden="true" />
          <span>{fatalError}</span>
        </div>
      )}

      {paced && running && (
        <p role="status" className="rounded-lg bg-muted px-3 py-2 text-[13px]">
          {WIZARD.run.paced(Math.ceil((total - done - failed) / (FREE_TIER_RPM * MODELS.length)))}
        </p>
      )}
      {busy && !paced && (
        <p role="status" className="rounded-lg bg-muted px-3 py-2 text-[13px]">
          {WIZARD.run.busy}
        </p>
      )}
      {running && <p className="text-[13px] text-muted-foreground">{WIZARD.run.background}</p>}

      <div className="flex justify-end gap-2">
        {running && (
          <Button variant="outline" size="xl" onClick={stop}>
            {WIZARD.run.stop}
          </Button>
        )}
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
