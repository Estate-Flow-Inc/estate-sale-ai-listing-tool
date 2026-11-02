import type { ReactNode } from 'react';

import { Container } from '@/components/common/Container';
import { ExternalLink } from '@/components/common/ExternalLink';
import { buttonVariants } from '@/components/ui/button';
import { OPENAI_API_KEYS_URL } from '@/config/constants';
import { HERO } from '@/constants/copy';

/** Hero copy on the left, media (the walkthrough video) on the right. */
export function Hero({ media }: { media: ReactNode }) {
  return (
    <section>
      <Container className="grid items-center gap-14 py-16 lg:grid-cols-2 lg:py-20">
        <div>
          <p className="mb-5 text-[13px] font-medium tracking-wide text-accent-ink uppercase">
            {HERO.eyebrow}
          </p>
          <h1 className="mb-5 font-serif text-5xl leading-[1.08] tracking-tight text-balance md:text-[56px]">
            {HERO.title}
          </h1>
          <p className="mb-9 max-w-[30em] text-lg text-muted-foreground text-pretty">{HERO.body}</p>
          <div className="flex flex-wrap gap-3">
            <ExternalLink href={OPENAI_API_KEYS_URL} className={buttonVariants({ size: 'xl' })}>
              {HERO.getKey}
            </ExternalLink>
            <a href="#start" className={buttonVariants({ variant: 'ghost', size: 'xl' })}>
              {HERO.cta}
            </a>
          </div>
        </div>
        {media}
      </Container>
    </section>
  );
}
