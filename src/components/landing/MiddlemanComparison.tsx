import { ArrowRight } from 'lucide-react';

import { Container } from '@/components/common/Container';
import {
  DEFAULT_COST_PER_ITEM,
  DEFAULT_MODEL_LABEL,
  SAVINGS_TABLE_ITEM_COUNTS,
  TYPICAL_AI_TOOL_RATE_PER_ITEM,
} from '@/config/pricing';
import { MIDDLEMAN } from '@/constants/copy';
import { formatCount, formatUsd } from '@/lib/format';
import { cn } from '@/lib/utils';

function Flow({ steps, highlight }: { steps: string[]; highlight?: number }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {steps.map((step, i) => (
        <span key={step} className="flex items-center gap-2">
          {i > 0 && <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />}
          <span
            className={cn(
              'rounded-md px-3 py-2',
              i === highlight
                ? 'border-[1.5px] border-dashed border-danger-ink text-danger-ink'
                : 'bg-muted'
            )}
          >
            {step}
          </span>
        </span>
      ))}
    </div>
  );
}

export function MiddlemanComparison() {
  return (
    <section>
      <Container className="flex flex-col gap-7 pt-22">
        <div className="max-w-2xl">
          <h2 className="mb-3 font-serif text-4xl leading-tight text-balance">{MIDDLEMAN.title}</h2>
          <p className="text-[17px] text-muted-foreground">{MIDDLEMAN.body}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-3.5 rounded-2xl border border-border bg-card p-5">
            <span className="text-[13px] font-medium text-muted-foreground">{MIDDLEMAN.theirsLabel}</span>
            <Flow steps={MIDDLEMAN.theirsSteps} highlight={1} />
            <span className="font-mono text-sm text-muted-foreground">
              ~{formatUsd(TYPICAL_AI_TOOL_RATE_PER_ITEM)} {MIDDLEMAN.perItem}
            </span>
          </div>
          <div className="flex flex-col gap-3.5 rounded-2xl border-[1.5px] border-accent-warm bg-[#faf7f2] p-5">
            <span className="text-[13px] font-medium text-accent-ink">{MIDDLEMAN.oursLabel}</span>
            <Flow steps={MIDDLEMAN.oursSteps} />
            <span className="font-mono text-sm">
              ~{formatUsd(DEFAULT_COST_PER_ITEM)} {MIDDLEMAN.perItem}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[560px] border-collapse text-[15px]">
            <thead>
              <tr className="text-left text-[13px] text-muted-foreground">
                <th className="px-5 py-3.5 font-medium">{MIDDLEMAN.tableItems}</th>
                <th className="px-5 py-3.5 font-medium">{MIDDLEMAN.tableTypical}</th>
                <th className="px-5 py-3.5 font-medium">
                  {MIDDLEMAN.tableYou} {DEFAULT_MODEL_LABEL}
                </th>
                <th className="px-5 py-3.5 font-medium">{MIDDLEMAN.tableSaved}</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {SAVINGS_TABLE_ITEM_COUNTS.map((count) => {
                const typical = count * TYPICAL_AI_TOOL_RATE_PER_ITEM;
                const yours = count * DEFAULT_COST_PER_ITEM;
                return (
                  <tr key={count} className="border-t border-muted">
                    <td className="px-5 py-3.5">{formatCount(count)}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{formatUsd(typical)}</td>
                    <td className="px-5 py-3.5">{formatUsd(yours)}</td>
                    <td className="px-5 py-3.5 font-medium text-accent-ink">
                      {formatUsd(typical - yours)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="font-serif text-[22px] italic">{MIDDLEMAN.youreWelcome}</p>
          <p className="max-w-2xl text-xs text-muted-foreground">{MIDDLEMAN.footnote}</p>
        </div>
      </Container>
    </section>
  );
}
