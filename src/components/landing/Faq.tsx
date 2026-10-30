import { Container } from '@/components/common/Container';
import { FAQ } from '@/constants/copy';

export function Faq() {
  return (
    <section id="faq" className="border-t border-border bg-warm-bg-alt">
      <Container className="max-w-3xl py-18">
        <h2 className="mb-7 font-serif text-3xl">{FAQ.title}</h2>
        <div className="flex flex-col">
          {FAQ.items.map((item, i) => (
            <details key={item.q} open={i === 0} className="group border-t border-[#e2ded6] py-4.5 last:border-b">
              <summary className="cursor-pointer font-medium">{item.q}</summary>
              <p className="mt-2.5 text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
