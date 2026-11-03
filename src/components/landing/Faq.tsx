import { Container } from '@/components/common/Container';
import { ExternalLink } from '@/components/common/ExternalLink';
import { FAQ } from '@/constants/copy';

type FaqItem = { q: string; a: string; link?: { text: string; href: string } };

/** Answer text, with the item's link phrase (if any) turned into a new-tab link. */
function Answer({ item }: { item: FaqItem }) {
  const at = item.link ? item.a.indexOf(item.link.text) : -1;
  if (!item.link || at < 0) return <>{item.a}</>;
  return (
    <>
      {item.a.slice(0, at)}
      <ExternalLink href={item.link.href} className="font-medium text-accent-ink underline underline-offset-2">
        {item.link.text}
      </ExternalLink>
      {item.a.slice(at + item.link.text.length)}
    </>
  );
}

export function Faq() {
  return (
    <section id="faq" className="border-t border-border bg-warm-bg-alt">
      <Container className="max-w-3xl py-18">
        <h2 className="mb-7 font-serif text-3xl">{FAQ.title}</h2>
        <div className="flex flex-col">
          {(FAQ.items as FaqItem[]).map((item, i) => (
            <details key={item.q} open={i === 0} className="group border-t border-[#e2ded6] py-4.5 last:border-b">
              <summary className="cursor-pointer font-medium">{item.q}</summary>
              <p className="mt-2.5 text-muted-foreground">
                <Answer item={item} />
              </p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
