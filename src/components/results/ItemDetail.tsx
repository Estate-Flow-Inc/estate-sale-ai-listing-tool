import { CheckSquare, X } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';

import { CopyButton } from '@/components/common/CopyButton';
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { DISCLAIMER, ITEM_DETAIL } from '@/constants/copy';
import { formatDimensions, formatUsdWhole } from '@/lib/format';
import type { ListingItem } from '@/store/listingStore';

function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2 border-t border-border pt-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[13px] font-semibold tracking-wide text-muted-foreground uppercase">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function Spec({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex flex-col">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}

/** The full listing for one item: everything the AI found, ready to copy. */
export function ItemDetail({ item, onClose }: { item: ListingItem | null; onClose: () => void }) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const l = item?.listing;

  // Full-size photo URLs only while the detail is open.
  useEffect(() => {
    if (!item) return;
    const urls = item.images.map((b) => URL.createObjectURL(b));
    setPhotoUrls(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [item]);

  const dims = l && formatDimensions(l.width_in, l.depth_in, l.height_in);
  const specs: [string, string | null][] = l
    ? [
        [ITEM_DETAIL.labels.brand, l.brand],
        [ITEM_DETAIL.labels.make, l.make],
        [ITEM_DETAIL.labels.model, l.model],
        [ITEM_DETAIL.labels.color, l.color],
        [ITEM_DETAIL.labels.materials, l.materials.join(', ') || null],
        [ITEM_DETAIL.labels.style, l.style],
        [ITEM_DETAIL.labels.era, l.era],
        [ITEM_DETAIL.labels.dimensions, dims ? `${dims} ${l.dimensions_estimated ? ITEM_DETAIL.estimated : ''}` : null],
        [ITEM_DETAIL.labels.weight, l.weight_lb ? `~${Math.round(l.weight_lb)} lb` : null],
      ]
    : [];

  return (
    <Dialog open={Boolean(l)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0">
        {item && l && (
          <div className="grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            {/* Photos */}
            <div className="flex flex-col gap-2 bg-warm-bg-alt p-4 md:sticky md:top-0 md:self-start">
              <img
                src={photoUrls[photoIndex] ?? item.thumbUrl}
                alt={l.title}
                className="aspect-square w-full rounded-lg bg-[#e9e4db] object-contain"
              />
              {item.images.length > 1 && (
                <div className="flex gap-2">
                  {photoUrls.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setPhotoIndex(i)}
                      aria-label={`Photo ${i + 1}`}
                      className="size-14 overflow-hidden rounded-md ring-accent-warm data-[active=true]:ring-2"
                      data-active={i === photoIndex}
                    >
                      <img src={src} alt="" className="size-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Listing */}
            <div className="flex flex-col gap-5 p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-muted-foreground">{l.category}</span>
                  <DialogTitle className="font-serif text-2xl leading-tight">{l.title}</DialogTitle>
                </div>
                <div className="flex flex-none items-center">
                  <CopyButton text={l.title} label={ITEM_DETAIL.labels.title} />
                  <DialogClose
                    aria-label={ITEM_DETAIL.close}
                    className="flex size-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
                    onClick={onClose}
                  >
                    <X className="size-5" aria-hidden="true" />
                  </DialogClose>
                </div>
              </div>

              {/* Value */}
              <div className="flex flex-col gap-2 rounded-xl bg-[#faf7f2] p-4">
                <span className="text-xs text-muted-foreground">{ITEM_DETAIL.value}</span>
                <span className="font-mono text-2xl">
                  {formatUsdWhole(l.resale_value_low)} to {formatUsdWhole(l.resale_value_high)}
                </span>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-accent-ink">
                    {ITEM_DETAIL.valueTag}
                  </span>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                    {ITEM_DETAIL.confidence(l.value_confidence)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{l.value_reasoning}</p>
                <p className="text-xs text-muted-foreground">{DISCLAIMER.short}</p>
              </div>

              <Section
                title={ITEM_DETAIL.sections.description}
                action={<CopyButton text={l.description} label={ITEM_DETAIL.sections.description} />}
              >
                <p className="text-[15px] leading-relaxed">{l.description}</p>
              </Section>

              <Section title={ITEM_DETAIL.sections.details}>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                  {specs.map(([label, value]) => (
                    <Spec key={label} label={label} value={value} />
                  ))}
                </dl>
              </Section>

              <Section title={ITEM_DETAIL.sections.condition}>
                <div className="flex items-start gap-3">
                  <span className="flex-none rounded-full bg-charcoal px-2.5 py-1 text-xs font-medium text-warm-bg">
                    {l.condition}
                  </span>
                  <p className="text-sm">{l.condition_notes}</p>
                </div>
              </Section>

              <Section title={ITEM_DETAIL.sections.shipping}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-sm font-medium">{l.shipping_method}</span>
                  <span className="font-mono text-sm">
                    {l.shipping_cost_low != null && l.shipping_cost_high != null
                      ? `${formatUsdWhole(l.shipping_cost_low)} to ${formatUsdWhole(l.shipping_cost_high)}`
                      : ITEM_DETAIL.pickupOnly}
                  </span>
                </div>
                {l.package_notes && <p className="text-sm text-muted-foreground">{l.package_notes}</p>}
                <p className="text-xs text-muted-foreground">{ITEM_DETAIL.shippingNote}</p>
              </Section>

              {l.notable_details.length > 0 && (
                <Section title={ITEM_DETAIL.sections.notable}>
                  <ul className="list-disc space-y-1 pl-5 text-sm">
                    {l.notable_details.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </Section>
              )}

              {l.verify_before_selling.length > 0 && (
                <Section title={ITEM_DETAIL.sections.verify}>
                  <ul className="space-y-1.5 text-sm">
                    {l.verify_before_selling.map((v) => (
                      <li key={v} className="flex items-start gap-2">
                        <CheckSquare className="mt-0.5 size-4 flex-none text-accent-ink" aria-hidden="true" />
                        {v}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {l.keywords.length > 0 && (
                <Section
                  title={ITEM_DETAIL.sections.keywords}
                  action={<CopyButton text={l.keywords.join(', ')} label={ITEM_DETAIL.sections.keywords} />}
                >
                  <div className="flex flex-wrap gap-1.5">
                    {l.keywords.map((k) => (
                      <span key={k} className="rounded-full bg-muted px-2.5 py-1 text-xs">
                        {k}
                      </span>
                    ))}
                  </div>
                </Section>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
