import type { AnchorHTMLAttributes } from 'react';

/** Link that opens in a new tab safely. */
export function ExternalLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}
