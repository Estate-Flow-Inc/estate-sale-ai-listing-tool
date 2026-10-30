# AI Estate Sale Listing

Turn item photos into estate sale listings. Free, open source, no account.

Bring your own OpenAI key. Your photos go straight from your browser to OpenAI, with no middleman and no markup. Download an Excel inventory with photo thumbnails and a printable inventory estimate PDF.

**Use it:** [tools.joinestateflow.com/ai-estate-sale-listing](https://tools.joinestateflow.com/ai-estate-sale-listing)

Built by [Estate Flow](https://joinestateflow.com).

---

## How it works

1. Paste your OpenAI API key
2. Pick a model and see the cost estimate
3. Add item photos
4. Review and edit titles, descriptions, categories, condition and prices
5. Download Excel and PDF

## Your key and photos

- Your API key is stored in this browser tab only (`sessionStorage`) and cleared when you close it.
- Requests go directly from your browser to OpenAI. Nothing passes through Estate Flow.
- No server, no login, no analytics on this page.
- Your items are saved in your browser (IndexedDB) so a refresh doesn't lose your work.

## Cost

You pay OpenAI directly at their published rates. With GPT-5.6 Luna, that's roughly $0.07 per 100 items. The app shows an estimate before every run.

## About AI prices

AI can describe an item from a photo. It can't see what that item actually sold for. Every price this tool gives is labeled as an estimate.

For real pricing, [Estate Flow](https://joinestateflow.com) pulls comps via eBay Sold listings and Google Lens. Estate Flow imports the Excel file this tool creates, so you can pick up where you left off.

---

## Run it locally

Requires Node 20+ and Yarn.

```bash
git clone https://github.com/[ORG]/ai-estate-sale-listing.git
cd ai-estate-sale-listing
yarn
yarn dev
```

Open the URL Vite prints and paste your OpenAI key.

### Scripts

| Command | What it does |
|---|---|
| `yarn dev` | Start the dev server |
| `yarn build` | Type check and build to `dist/` |
| `yarn preview` | Serve the production build |
| `yarn lint` | Lint with oxlint |

## Stack

- Vite, React, TypeScript
- Tailwind CSS and shadcn/ui
- ExcelJS (Excel with thumbnails), jsPDF (PDF)
- Zustand (state), idb-keyval (IndexedDB)

Everything runs in the browser. There is no backend.

## Project structure

```
src/
  components/   UI and screens
  providers/    AI providers (OpenAI today)
  lib/          images, cost, Excel, PDF, storage
  store.ts      app state
```

## Adding a provider

Each provider is one file in `src/providers/` that implements the `Provider` interface in `types.ts`, including its model list and prices. Add the file, register it, and it shows up in the model picker.

## Deploy

It's a static site. On Vercel, import the repo and use the Vite preset. Any static host works.

## Contributing

Issues and pull requests are welcome. Keep it simple: no servers, no tracking.

## License

[MIT](LICENSE). The code is free to use, change and share.

The Estate Flow name and logo are not covered by the license. If you run your own copy, please give it your own name.
