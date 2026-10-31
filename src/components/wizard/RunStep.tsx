import { CircleAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { WIZARD } from '@/constants/copy';
import { formatUsd } from '@/lib/format';
import { useListingStore } from '@/store/listingStore';
import { costFromUsage } from '@/utils/costEstimator';

/** Live progress while listings are written. */
export function RunStep({ onView, onFixKey }: { onView: () => void; onFixKey: () => void }) {
  const { items, running, modelId, fatalError, stop } = useListingStore();

  const total = items.length;
  const done = items.filter((i) => i.status === 'done').length;
  const failed = items.filter((i) => i.status === 'error').length;
  const spent = modelId
    ? items.reduce((sum, i) => sum + (i.usage ? costFromUsage(modelId, i.usage) : 0), 0)
    : 0;
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

      {fatalError && (
        <div role="alert" className="flex items-start gap-2 rounded-lg bg-[#f7e4e0] p-3 text-sm text-danger-ink">
          <CircleAlert className="mt-0.5 size-4 flex-none" aria-hidden="true" />
          <span>{fatalError}</span>
        </div>
      )}

      {running && <p className="text-[13px] text-muted-foreground">{WIZARD.run.background}</p>}

      <div className="flex justify-end gap-2">
        {running && (
          <Button variant="outline" size="xl" onClick={stop}>
            {WIZARD.run.stop}
          </Button>
        )}
        {fatalError && !running && (
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
