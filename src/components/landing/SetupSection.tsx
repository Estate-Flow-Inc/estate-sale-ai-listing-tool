import type { ReactNode } from 'react';

import { Container } from '@/components/common/Container';
import { SETUP_SECTION } from '@/constants/copy';

/** Centered home for the tool itself (setup card, then results). */
export function SetupSection({ children }: { children: ReactNode }) {
  return (
    <section id="start" className="scroll-mt-6">
      <Container className="flex max-w-3xl flex-col gap-6 pb-20">
        <div className="text-center">
          <h2 className="mb-2 font-serif text-3xl">{SETUP_SECTION.title}</h2>
          <p className="text-muted-foreground">{SETUP_SECTION.body}</p>
        </div>
        {children}
      </Container>
    </section>
  );
}
