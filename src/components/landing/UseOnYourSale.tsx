import { Container } from '@/components/common/Container';
import { USE_ON_SALE } from '@/constants/copy';

export function UseOnYourSale() {
  return (
    <section className="border-t border-border">
      <Container className="flex flex-wrap items-start justify-between gap-10 py-18">
        <div className="min-w-0 flex-[1_1_320px]">
          <h2 className="mb-3 font-serif text-3xl">{USE_ON_SALE.title}</h2>
          <p className="max-w-[30em] text-muted-foreground">{USE_ON_SALE.body}</p>
        </div>
        <ul className="grid min-w-0 flex-[1_1_560px] gap-3 sm:grid-cols-3">
          {USE_ON_SALE.items.map((item) => (
            <li key={item.title} className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4.5">
              <span className="font-medium">{item.title}</span>
              <span className="text-[13px] text-muted-foreground">{item.body}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
