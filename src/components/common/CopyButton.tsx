import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ITEM_DETAIL } from '@/constants/copy';

/** Copies text and briefly confirms. */
export function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked; nothing useful to show.
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={copy} aria-label={`${ITEM_DETAIL.copy} ${label}`}>
      {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      {copied ? ITEM_DETAIL.copied : ITEM_DETAIL.copy}
    </Button>
  );
}
