import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { ExternalLink } from '@/components/common/ExternalLink';
import { Button } from '@/components/ui/button';
import { estateFlowLink } from '@/config/constants';
import { USE_ON_SALE } from '@/constants/copy';
import type { ListingItem } from '@/store/listingStore';
import { downloadInventoryExcel } from '@/utils/exportExcel';

/** Slim download bar above the results. */
export function ExportPanel({ items }: { items: ListingItem[] }) {
  const [busy, setBusy] = useState(false);
  const ready = items.some((i) => i.listing);

  const exportExcel = async () => {
    setBusy(true);
    try {
      await downloadInventoryExcel(items);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{USE_ON_SALE.title}</p>
        <p className="text-xs text-muted-foreground">
          {USE_ON_SALE.body} {USE_ON_SALE.importNote}{' '}
          <ExternalLink href={estateFlowLink('export_panel', true)} className="font-medium text-accent-ink hover:underline">
            {USE_ON_SALE.importCta}
          </ExternalLink>
        </p>
      </div>
      <div className="flex flex-none items-center">
        <Button className="h-10 px-3.5" disabled={!ready || busy} onClick={exportExcel}>
          {busy ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Download aria-hidden="true" />}
          {busy ? USE_ON_SALE.working : USE_ON_SALE.excel}
        </Button>
      </div>
    </div>
  );
}
