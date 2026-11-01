import { Container } from '@/components/common/Container';
import { ExternalLink } from '@/components/common/ExternalLink';
import { ESTATE_FLOW_URL, GITHUB_REPO_URL } from '@/config/constants';
import { DISCLAIMER, ESTATE_FLOW_GLOBAL_NAME, FOOTER } from '@/constants/copy';

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col gap-2 pt-8 text-xs text-muted-foreground">
        <h2 className="font-medium text-foreground">{DISCLAIMER.title}</h2>
        <ul className="flex max-w-3xl flex-col gap-1">
          {DISCLAIMER.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </Container>
      <Container className="flex flex-wrap justify-between gap-4 py-7 text-sm text-muted-foreground">
        <span>
          {FOOTER.builtBy}{' '}
          <ExternalLink href={ESTATE_FLOW_URL} className="text-accent-ink hover:underline">
            {ESTATE_FLOW_GLOBAL_NAME}
          </ExternalLink>
          . {FOOTER.license}
        </span>
        <span className="flex gap-5">
          <ExternalLink href={GITHUB_REPO_URL} className="text-accent-ink hover:underline">
            {FOOTER.github}
          </ExternalLink>
          <ExternalLink href={ESTATE_FLOW_URL} className="text-accent-ink hover:underline">
            {ESTATE_FLOW_GLOBAL_NAME}
          </ExternalLink>
        </span>
      </Container>
    </footer>
  );
}
