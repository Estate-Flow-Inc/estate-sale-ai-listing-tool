import { CircleAlert, Loader2 } from 'lucide-react';

import { RESULTS } from '@/constants/copy';
import { formatUsdWhole } from '@/lib/format';
import type { ListingItem } from '@/store/listingStore';

/** Grid tile: photo, title, value and condition. Opens the detail view when ready. */
export function ItemCard({ item, onOpen }: { item: ListingItem; onOpen: () => void }) {
  const l = item.listing;

  return (
    <li className="flex">
      <button
        type="button"
        onClick={onOpen}
        disabled={!l}
        aria-label={l ? `${RESULTS.open}: ${l.title}` : undefined}
        className="group flex w-full flex-col overflow-hidden rounded-xl border border-border bg-card text-left transition-shadow enabled:hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-default"
      >
        <span className="relative block aspect-[4/3] w-full overflow-hidden bg-[#e9e4db]">
          <img
            src={item.thumbUrl}
            alt=""
            loading="lazy"
            className="absolute inset-0 size-full object-cover transition-transform duration-300 group-enabled:group-hover:scale-[1.03]"
          />
          {item.status !== 'done' && (
            <span className="absolute inset-0 flex items-center justify-center bg-warm-bg/70 text-[13px] font-medium">
              {item.status === 'error' ? (
                <span className="flex items-center gap-1.5 text-danger-ink" title={item.error}>
                  <CircleAlert className="size-4" aria-hidden="true" />
                  {RESULTS.failed}
                </span>
              ) : item.status === 'generating' ? (
                <span className="flex items-center gap-1.5 px-2 text-center">
                  <Loader2 className="size-4 flex-none animate-spin" aria-hidden="true" />
                  {item.busy ? RESULTS.busy : RESULTS.writing}
                </span>
              ) : (
                <span className="text-muted-foreground">{RESULTS.queued}</span>
              )}
            </span>
          )}
        </span>
        {l && (
          <span className="flex flex-1 flex-col gap-2 p-3">
            <span className="line-clamp-2 min-h-10 text-sm leading-5 font-medium">{l.title}</span>
            <span className="mt-auto flex items-center justify-between gap-2">
              <span className="font-mono text-[15px]">{formatUsdWhole(l.suggested_price)}</span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">{l.condition}</span>
            </span>
          </span>
        )}
      </button>
    </li>
  );
}
