import { Container } from '@/components/common/Container';
import { ExternalLink } from '@/components/common/ExternalLink';
import { buttonVariants } from '@/components/ui/button';
import { ESTATE_FLOW_SIGNUP_URL } from '@/config/constants';
import { ESTATE_FLOW_BAND } from '@/constants/copy';

/** Dark closing band: what Estate Flow adds, and the import CTA. */
export function EstateFlowBand() {
  return (
    <section className="bg-charcoal text-warm-bg">
      <Container className="grid items-center gap-14 py-20 lg:grid-cols-2">
        <div>
          <p className="mb-4 text-[13px] font-medium tracking-wide text-[#c9b79c] uppercase">
            {ESTATE_FLOW_BAND.eyebrow}
          </p>
          <h2 className="mb-4 font-serif text-4xl leading-tight text-balance">{ESTATE_FLOW_BAND.title}</h2>
          {ESTATE_FLOW_BAND.paragraphs.map((p) => (
            <p key={p} className="mb-4 text-[17px] text-warm-bg/75">
              {p}
            </p>
          ))}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <ExternalLink href={ESTATE_FLOW_SIGNUP_URL} className={buttonVariants({ size: 'xl' })}>
              {ESTATE_FLOW_BAND.cta}
            </ExternalLink>
            <span className="text-sm text-warm-bg/75">{ESTATE_FLOW_BAND.note}</span>
          </div>
        </div>
        <ul className="flex flex-col">
          {ESTATE_FLOW_BAND.features.map((f) => (
            <li key={f.title} className="border-t border-white/15 py-4.5 last:border-b">
              <div className="font-medium">{f.title}</div>
              <div className="text-sm text-warm-bg/75">{f.body}</div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
