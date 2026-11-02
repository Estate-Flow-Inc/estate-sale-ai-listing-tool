// Injects the pre-rendered page and structured data into dist/index.html.
// Runs after `vite build` and the SSR build (see the "build" script).
import { readFile, rm, writeFile } from 'node:fs/promises';

const { renderPage, renderStructuredData } = await import('../dist-ssr/entry-server.js');

const file = new URL('../dist/index.html', import.meta.url);
let html = await readFile(file, 'utf8');

if (!html.includes('<div id="root"></div>')) throw new Error('prerender: #root not found');
html = html.replace('<div id="root"></div>', `<div id="root">${renderPage()}</div>`);
html = html.replace('</head>', `    ${renderStructuredData()}\n  </head>`);

await writeFile(file, html);
await rm(new URL('../dist-ssr', import.meta.url), { recursive: true, force: true });
console.log('prerender: dist/index.html updated');
