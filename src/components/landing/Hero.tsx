import type { ReactNode } from 'react';

import { Container } from '@/components/common/Container';
import { HERO } from '@/constants/copy';

/** Hero copy on the left, the setup card (passed in) on the right. */
export function Hero({ setup }: { setup: ReactNode }) {
  return (
    <section>
      <Container className="grid items-start gap-14 py-16 lg:grid-cols-2 lg:py-20">
        <div className="lg:pt-6">
          <p className="mb-5 text-[13px] font-medium tracking-wide text-accent-ink uppercase">
            {HERO.eyebrow}
          </p>
          <h1 className="mb-5 font-serif text-5xl leading-[1.08] tracking-tight text-balance md:text-[56px]">
            {HERO.title}
          </h1>
          <p className="mb-8 max-w-[30em] text-lg text-muted-foreground text-pretty">{HERO.body}</p>
          <ol id="how" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {HERO.steps.map((step, i) => (
              <li key={step} className="flex items-baseline gap-3">
                <span className="font-mono text-[13px] text-accent-ink">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[15px]">{step}</span>
              </li>
            ))}
          </ol>
        </div>
        {setup}
      </Container>
    </section>
  );
}
