import { Container } from '@/components/common/Container';
import { TRUST_POINTS } from '@/constants/copy';

export function TrustPoints() {
  return (
    <section className="border-y border-border bg-warm-bg-alt">
      <Container className="grid gap-8 py-10 md:grid-cols-3">
        {TRUST_POINTS.map((point) => (
          <div key={point.title} className="flex flex-col gap-1.5">
            <h2 className="font-semibold">{point.title}</h2>
            <p className="text-[15px] text-muted-foreground">{point.body}</p>
          </div>
        ))}
      </Container>
    </section>
  );
}
