import { PlayCircle, X } from 'lucide-react';
import { useState } from 'react';

import { ExternalLink } from '@/components/common/ExternalLink';
import { buttonVariants } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { OPENAI_API_KEYS_URL, WALKTHROUGH_YOUTUBE_URL } from '@/config/constants';
import { HOW_IT_WORKS } from '@/constants/copy';

/** Header "How it works": the basic steps, then the full walkthrough. */
export function HowItWorksDialog({ triggerClassName }: { triggerClassName?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className={triggerClassName} onClick={() => setOpen(true)}>
        {HOW_IT_WORKS.title}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <div className="mb-6 flex items-start justify-between gap-4">
            <DialogTitle className="font-serif text-2xl">{HOW_IT_WORKS.title}</DialogTitle>
            <DialogClose
              aria-label={HOW_IT_WORKS.close}
              className="-mt-1 -mr-2 flex size-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
            >
              <X className="size-5" aria-hidden="true" />
            </DialogClose>
          </div>

          <ol className="mb-7 flex flex-col gap-4">
            {HOW_IT_WORKS.steps.map((step, i) => (
              <li key={step.title} className="flex gap-3.5">
                <span className="flex size-7 flex-none items-center justify-center rounded-full bg-muted font-mono text-[13px] text-accent-ink">
                  {i + 1}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="font-medium">{step.title}</span>
                  <span className="text-sm text-muted-foreground">{step.body}</span>
                  {i === 0 && (
                    <ExternalLink href={OPENAI_API_KEYS_URL} className="text-sm font-medium text-accent-ink hover:underline">
                      {HOW_IT_WORKS.getKey}
                    </ExternalLink>
                  )}
                </span>
              </li>
            ))}
          </ol>

          <div className="flex flex-wrap items-center justify-between gap-3">
            {WALKTHROUGH_YOUTUBE_URL ? (
              <ExternalLink
                href={WALKTHROUGH_YOUTUBE_URL}
                className="flex items-center gap-2 text-sm font-medium text-accent-ink hover:underline"
              >
                <PlayCircle className="size-4" aria-hidden="true" />
                {HOW_IT_WORKS.watch}
              </ExternalLink>
            ) : (
              <a
                href="#top"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-sm font-medium text-accent-ink hover:underline"
              >
                <PlayCircle className="size-4" aria-hidden="true" />
                {HOW_IT_WORKS.watch}
              </a>
            )}
            <a href="#start" onClick={() => setOpen(false)} className={buttonVariants({ size: 'xl' })}>
              {HOW_IT_WORKS.start}
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
