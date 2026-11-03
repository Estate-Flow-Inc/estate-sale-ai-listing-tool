import { Button } from '@/components/ui/button';
import { getModel } from '@/config/models';
import { ESTIMATE, WIZARD } from '@/constants/copy';
import { formatUsd, formatUsdRange } from '@/lib/format';
import type { CostEstimate } from '@/utils/costEstimator';

/** "Here's what this should cost. Continue?" shown before any API call. */
export function CostConfirm({
  estimate,
  modelId,
  itemCount,
  onConfirm,
  onBack,
}: {
  estimate: CostEstimate;
  modelId: string;
  itemCount: number;
  onConfirm: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <dl className="flex flex-col gap-2.5 rounded-xl border-[1.5px] border-accent-warm bg-[#faf7f2] p-4 text-sm">
        <div className="flex justify-between gap-3 font-semibold">
          <dt>{ESTIMATE.freeTier}</dt>
          <dd className="font-mono">{ESTIMATE.free}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>{ESTIMATE.yourCost}</dt>
          <dd className="font-mono">~{formatUsd(estimate.expected)}</dd>
        </div>
        <div className="flex justify-between gap-3 text-muted-foreground">
          <dt>{ESTIMATE.competitor}</dt>
          <dd className="font-mono line-through">
            {formatUsdRange(estimate.competitor.low, estimate.competitor.high)}
          </dd>
        </div>
        <div className="flex justify-between gap-3 border-t border-border pt-2.5 font-semibold">
          <dt>{ESTIMATE.savings}</dt>
          <dd className="font-mono text-accent-ink">
            {formatUsdRange(estimate.savings.low, estimate.savings.high)}
          </dd>
        </div>
      </dl>
      <p className="text-xs text-muted-foreground">
        {ESTIMATE.footnote(getModel(modelId).label, formatUsd(estimate.low), formatUsd(estimate.high))}
      </p>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="xl" onClick={onBack}>
          {WIZARD.back}
        </Button>
        <Button size="xl" onClick={onConfirm} autoFocus>
          {ESTIMATE.confirm(itemCount)}
        </Button>
      </div>
    </div>
  );
}
