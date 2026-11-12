import { Container } from '@/components/common/Container';
import { NAV, TOOL_NAME } from '@/constants/copy';
import { cn } from '@/lib/utils';

import { HowItWorksDialog } from '@/components/landing/HowItWorksDialog';

import { EstateFlowLogo } from './EstateFlowLogo';

const navLink =
  'rounded-md px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted';

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <Container className="flex flex-wrap items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-3.5">
          <EstateFlowLogo />
          <span className="h-5 w-px bg-input" aria-hidden="true" />
          <span className="text-sm font-medium text-muted-foreground">{TOOL_NAME}</span>
        </div>
        <nav className="flex flex-wrap items-center gap-1">
          <HowItWorksDialog triggerClassName={cn(navLink, 'inline-flex cursor-pointer')} />
          <a href="#faq" className={cn(navLink, 'hidden sm:inline-flex')}>
            {NAV.faq}
          </a>
        </nav>
      </Container>
    </header>
  );
}
