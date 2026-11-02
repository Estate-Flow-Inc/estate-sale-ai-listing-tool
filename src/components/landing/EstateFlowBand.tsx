import { Container } from '@/components/common/Container';
import { ExternalLink } from '@/components/common/ExternalLink';
import { buttonVariants } from '@/components/ui/button';
import { estateFlowLink } from '@/config/constants';
import { ESTATE_FLOW_BAND } from '@/constants/copy';

/** Dark closing band: bring your Excel file into Estate Flow. */
export function EstateFlowBand() {
  return (
    <section className="bg-charcoal text-warm-bg">
      <Container className="flex max-w-3xl flex-col items-center py-20 text-center">
        <p className="mb-4 text-[13px] font-medium tracking-wide text-[#c9b79c] uppercase">
          {ESTATE_FLOW_BAND.eyebrow}
        </p>
        <h2 className="mb-5 font-serif text-4xl leading-tight">
          {/* One sentence per line, so the brand name never splits across lines. */}
          {ESTATE_FLOW_BAND.title.split(/(?<=\.) /).map((sentence) => (
            <span key={sentence} className="block">
              {sentence}
            </span>
          ))}
        </h2>
        {ESTATE_FLOW_BAND.paragraphs.map((p) => (
          <p key={p} className="mb-4 text-[17px] text-warm-bg/75">
            {p}
          </p>
        ))}
        <ExternalLink href={estateFlowLink('band_cta', true)} className={buttonVariants({ size: 'xl', className: 'mt-5' })}>
          {ESTATE_FLOW_BAND.cta}
        </ExternalLink>
        <span className="mt-4 text-sm text-warm-bg/60">{ESTATE_FLOW_BAND.note}</span>
      </Container>
    </section>
  );
}
