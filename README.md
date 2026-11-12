# AI Estate Sale Listing

Turn item photos into estate sale listings. Free, open source, no account.

Bring your own Google Gemini key. Your photos go straight from your browser to Google, with no middleman and no markup. Download a .zip with an Excel inventory and your photos, named by SKU.

**Use it:** [joinestateflow.com/tools/estate-sale-ai-listing-tool](https://joinestateflow.com/tools/estate-sale-ai-listing-tool)

Built by [Estate Flow](https://joinestateflow.com/?utm_source=ai-listing-tool&utm_medium=referral&utm_campaign=free-tool&utm_content=readme).

---

## How it works

1. Add item photos (one per item, up to 500 per batch)
2. Paste your Google Gemini API key (free from [Google AI Studio](https://aistudio.google.com/app/apikey), no credit card)
3. Check the cost: $0 on Google's free tier
4. Review titles, descriptions, categories, condition and suggested prices
5. Download your inventory (.zip: Excel plus photos, named by SKU)

## Your key and photos

- Your API key is kept in `sessionStorage` only while the page is open, and cleared when you leave, refresh or close it.
- Requests go directly from your browser to Google. Nothing passes through Estate Flow.
- On Google's free tier, Google may use what you send to improve its products. Turn on billing in Google AI Studio to opt out.
- No server, no login, no analytics on this page.
- Your items are saved in your browser (IndexedDB) so a refresh doesn't lose your work.

## Cost

Google's free tier allows about 500 listings a day at no cost. Items alternate between Gemini 3.1 Flash-Lite and Gemini 3.5 Flash-Lite, and a failed item retries on the other model. With billing turned on in Google AI Studio, you pay Google directly at their published rates, usually well under a dollar per hundred items. The app shows an estimate before every run.

## About AI prices

AI can describe an item from a photo. It can't see what that item actually sold for. Every price this tool gives is labeled as an estimate.

For real pricing, [Estate Flow](https://joinestateflow.com/?utm_source=ai-listing-tool&utm_medium=referral&utm_campaign=free-tool&utm_content=readme) finds comps with Google Lens image search, with eBay Sold listings one tap away to verify. Estate Flow imports the Excel file this tool creates, so you can pick up where you left off.

---

## Run it locally

Requires Node 20+ and Yarn.

```bash
git clone https://github.com/Estate-Flow-Inc/estate-sale-ai-listing-tool.git
cd estate-sale-ai-listing-tool
yarn
yarn dev
```

Open the URL Vite prints and paste your Gemini key.

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
- ExcelJS (Excel with thumbnails), fflate (zip)
- Zustand (state), IndexedDB (saved work)

Everything runs in the browser. There is no backend.


## Adding a provider

The tool uses Google Gemini (`src/providers/gemini.ts`). Every provider implements the `Provider` interface in `src/providers/types.ts`, so adding another means one file plus its models and prices in `src/config/models.ts`.

## Deploy

It's a static site. On Vercel, import the repo and use the Vite preset. Any static host works.

## Contributing

Issues and pull requests are welcome. Keep it simple: no servers, no tracking.

## License

[MIT](LICENSE). The code is free to use, change and share.

The Estate Flow name and logo are not covered by the license. If you run your own copy, please give it your own name.
