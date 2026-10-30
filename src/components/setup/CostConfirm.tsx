import { Button } from '@/components/ui/button';
import { getModel } from '@/config/models';
import { ESTIMATE } from '@/constants/copy';
import { formatUsd } from '@/lib/format';
import type { CostEstimate } from '@/utils/costEstimator';

/** "Here's what this should cost. Continue?" shown before any API call. */
export function CostConfirm({
  estimate,
  modelId,
  onConfirm,
  onCancel,
}: {
  estimate: CostEstimate;
  modelId: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      role="region"
      aria-label={ESTIMATE.title}
      className="flex flex-col gap-4 rounded-xl border-[1.5px] border-accent-warm bg-[#faf7f2] p-4"
    >
      <span className="text-sm font-semibold">{ESTIMATE.title}</span>
      <dl className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between gap-3">
          <dt>{ESTIMATE.yourCost(getModel(modelId).label)}</dt>
          <dd className="font-mono">~{formatUsd(estimate.expected)}</dd>
        </div>
        <div className="flex justify-between gap-3 text-muted-foreground">
          <dt>{ESTIMATE.competitor}</dt>
          <dd className="font-mono line-through">~{formatUsd(estimate.competitor)}</dd>
        </div>
        <div className="flex justify-between gap-3 border-t border-border pt-2 font-semibold">
          <dt>{ESTIMATE.savings}</dt>
          <dd className="font-mono text-accent-ink">~{formatUsd(estimate.savings)}</dd>
        </div>
      </dl>
      <p className="text-xs text-muted-foreground">
        {ESTIMATE.range(formatUsd(estimate.low), formatUsd(estimate.high))}
      </p>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="xl" onClick={onCancel}>
          {ESTIMATE.cancel}
        </Button>
        <Button size="xl" onClick={onConfirm} autoFocus>
          {ESTIMATE.confirm}
        </Button>
      </div>
    </div>
  );
}
