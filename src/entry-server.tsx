import { renderToString } from 'react-dom/server';

import { GITHUB_REPO_URL } from '@/config/constants';
import { ESTATE_FLOW_GLOBAL_NAME, FAQ, HERO, TOOL_NAME } from '@/constants/copy';
import { LandingPage } from '@/pages/LandingPage';

/**
 * Build-time pre-render (scripts/prerender.mjs). Ships the full page text in
 * the HTML so search engines don't have to run JavaScript to read it.
 */
export function renderPage() {
  return renderToString(<LandingPage />);
}

const SITE_URL = 'https://tools.joinestateflow.com/ai-estate-sale-listing';

/** Structured data, built from the same copy the page shows. */
export function renderStructuredData() {
  const app = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: TOOL_NAME,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: SITE_URL,
    description: HERO.body,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@type': 'Organization', name: ESTATE_FLOW_GLOBAL_NAME, url: 'https://joinestateflow.com' },
    sameAs: [GITHUB_REPO_URL],
  };
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
  // Escape "<" so copy can never close the script tag.
  const json = (data: object) => JSON.stringify(data).replace(/</g, '\\u003c');
  return [app, faq]
    .map((data) => `<script type="application/ld+json">${json(data)}</script>`)
    .join('\n    ');
}
