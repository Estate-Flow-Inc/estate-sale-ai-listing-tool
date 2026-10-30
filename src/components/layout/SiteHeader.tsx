import { Code } from 'lucide-react';

import { Container } from '@/components/common/Container';
import { ExternalLink } from '@/components/common/ExternalLink';
import { buttonVariants } from '@/components/ui/button';
import { ESTATE_FLOW_URL, GITHUB_REPO_URL } from '@/config/constants';
import { NAV, TOOL_NAME } from '@/constants/copy';
import { cn } from '@/lib/utils';

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
          <a href="#how" className={cn(navLink, 'hidden sm:inline-flex')}>
            {NAV.howItWorks}
          </a>
          <a href="#faq" className={cn(navLink, 'hidden sm:inline-flex')}>
            {NAV.faq}
          </a>
          <ExternalLink href={GITHUB_REPO_URL} className={cn(navLink, 'inline-flex items-center gap-1.5')}>
            <Code className="size-4" aria-hidden="true" />
            {NAV.source}
          </ExternalLink>
          <ExternalLink
            href={ESTATE_FLOW_URL}
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'ml-1 h-10 px-3.5')}
          >
            {NAV.tryEstateFlow}
          </ExternalLink>
        </nav>
      </Container>
    </header>
  );
}
