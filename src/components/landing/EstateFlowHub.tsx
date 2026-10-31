import {
  BarChart3,
  Barcode,
  CreditCard,
  FileText,
  FolderTree,
  ScanSearch,
  Send,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

import { Container } from '@/components/common/Container';
import { ExternalLink } from '@/components/common/ExternalLink';
import { buttonVariants } from '@/components/ui/button';
import { ESTATE_FLOW_SIGNUP_URL } from '@/config/constants';
import { ESTATE_FLOW_HUB } from '@/constants/copy';

/** Same order as ESTATE_FLOW_HUB.features. */
const ICONS: LucideIcon[] = [Users, ScanSearch, FolderTree, Barcode, Send, CreditCard, FileText, BarChart3, Wallet];

/** "So what does Estate Flow do?" Other tools are a middleman; we run the business. */
export function EstateFlowHub() {
  return (
    <section>
      <Container className="flex flex-col gap-10 py-22">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-2xl">
            <p className="mb-4 text-[13px] font-medium tracking-wide text-accent-ink uppercase">
              {ESTATE_FLOW_HUB.eyebrow}
            </p>
            <h2 className="mb-5 font-serif text-4xl leading-tight text-balance">{ESTATE_FLOW_HUB.title}</h2>
            <p className="text-[17px] text-muted-foreground">{ESTATE_FLOW_HUB.theirs}</p>
            <p className="text-[17px] font-medium">{ESTATE_FLOW_HUB.ours}</p>
          </div>
          <ExternalLink href={ESTATE_FLOW_SIGNUP_URL} className={buttonVariants({ size: 'xl' })}>
            {ESTATE_FLOW_HUB.cta}
          </ExternalLink>
        </div>

        <ul className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {ESTATE_FLOW_HUB.features.map((f, i) => {
            const Icon = ICONS[i];
            return (
              <li key={f.title} className="flex gap-4 bg-card p-6">
                <Icon className="mt-0.5 size-5 flex-none text-accent-ink" aria-hidden="true" />
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{f.title}</span>
                  <span className="text-sm text-muted-foreground">{f.body}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
