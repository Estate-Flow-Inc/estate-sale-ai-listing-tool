import { CircleAlert, Loader2 } from 'lucide-react';

import { RESULTS } from '@/constants/copy';
import { formatUsdWhole } from '@/lib/format';
import type { ListingItem } from '@/store/listingStore';

/** Grid tile: photo, title, value and condition. Opens the detail view when ready. */
export function ItemCard({ item, onOpen }: { item: ListingItem; onOpen: () => void }) {
  const l = item.listing;

  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        disabled={!l}
        aria-label={l ? `${RESULTS.open}: ${l.title}` : undefined}
        className="group flex w-full flex-col overflow-hidden rounded-xl border border-border bg-card text-left transition-shadow enabled:hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-default"
      >
        <span className="relative block aspect-square bg-[#e9e4db]">
          <img src={item.images[0]} alt="" className="size-full object-cover" />
          {item.status !== 'done' && (
            <span className="absolute inset-0 flex items-center justify-center bg-warm-bg/70 text-[13px] font-medium">
              {item.status === 'error' ? (
                <span className="flex items-center gap-1.5 text-danger-ink" title={item.error}>
                  <CircleAlert className="size-4" aria-hidden="true" />
                  {RESULTS.failed}
                </span>
              ) : item.status === 'generating' ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  {RESULTS.writing}
                </span>
              ) : (
                <span className="text-muted-foreground">{RESULTS.queued}</span>
              )}
            </span>
          )}
        </span>
        {l && (
          <span className="flex flex-col gap-1.5 p-3">
            <span className="line-clamp-2 text-sm font-medium">{l.title}</span>
            <span className="flex items-center justify-between gap-2">
              <span className="font-mono text-[13px]">
                {formatUsdWhole(l.resale_value_low)} to {formatUsdWhole(l.resale_value_high)}
              </span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">{l.condition}</span>
            </span>
          </span>
        )}
      </button>
    </li>
  );
}
