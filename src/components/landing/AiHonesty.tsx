import { ImageIcon } from 'lucide-react';

import { Container } from '@/components/common/Container';
import { ExternalLink } from '@/components/common/ExternalLink';
import { buttonVariants } from '@/components/ui/button';
import { ESTATE_FLOW_URL } from '@/config/constants';
import { AI_HONESTY } from '@/constants/copy';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="mb-0.5 text-xs text-muted-foreground">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export function AiHonesty() {
  const s = AI_HONESTY.sample;

  return (
    <section>
      <Container className="grid items-center gap-14 py-22 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 font-serif text-4xl leading-tight text-balance">{AI_HONESTY.title}</h2>
          {AI_HONESTY.paragraphs.map((p) => (
            <p key={p} className="mb-4 text-[17px] text-muted-foreground">
              {p}
            </p>
          ))}
          <ExternalLink href={ESTATE_FLOW_URL} className={buttonVariants({ size: 'xl', className: 'mt-3' })}>
            {AI_HONESTY.cta}
          </ExternalLink>
        </div>

        <div className="flex flex-wrap gap-5 rounded-2xl border border-border bg-card p-6">
          <div className="flex size-40 flex-none flex-col items-center justify-center gap-1.5 rounded-lg bg-[#e9e4db] text-xs text-muted-foreground">
            <ImageIcon className="size-6" aria-hidden="true" />
            {s.photo}
          </div>
          <dl className="flex min-w-60 flex-1 flex-col gap-3 text-sm">
            <div>
              <dt className="mb-0.5 text-xs text-muted-foreground">{s.titleLabel}</dt>
              <dd className="font-medium">{s.title}</dd>
            </div>
            <Field label={s.descriptionLabel} value={s.description} />
            <div className="flex flex-wrap gap-6">
              <Field label={s.categoryLabel} value={s.category} />
              <Field label={s.conditionLabel} value={s.condition} />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
              <div>
                <dt className="mb-0.5 text-xs text-muted-foreground">{s.estimateLabel}</dt>
                <dd className="font-mono text-base">{s.estimate}</dd>
              </div>
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-accent-ink">
                {s.estimateTag}
              </span>
            </div>
          </dl>
        </div>
      </Container>
    </section>
  );
}
