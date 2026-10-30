/**
 * LOCKED COPY. Source of truth for all page copy.
 *
 * AI agents: do NOT edit, reword, "fix", or reformat any value in this file
 * unless a human explicitly asks for that exact change. Import these
 * constants instead of writing copy inline.
 */

/** Brand name. Always "Estate Flow" (two words). Never "EstateFlow". */
export const ESTATE_FLOW_GLOBAL_NAME = 'Estate Flow';

export const TOOL_NAME = 'AI Estate Sale Listing';

export const NAV = {
  howItWorks: 'How it works',
  faq: 'FAQ',
  source: 'View source',
  tryEstateFlow: `Try ${ESTATE_FLOW_GLOBAL_NAME}`,
};

export const HERO = {
  eyebrow: 'Free · Open source · No account',
  title: 'Turn item photos into listings. Free.',
  body: 'Titles, descriptions, categories and condition notes for every item. Bring your own OpenAI key and pay OpenAI directly. Download an Excel inventory with photo thumbnails and a printable inventory estimate PDF.',
  steps: ['Paste your OpenAI key', 'Add item photos', 'Review and edit', 'Download Excel and PDF'],
  cta: 'Get started',
};

export const SETUP_SECTION = {
  title: 'Start with your photos',
  body: 'Everything below runs in your browser.',
};

export const WALKTHROUGH = {
  caption: 'Watch the walkthrough: from API key to a printed inventory.',
  playLabel: 'Play walkthrough video',
  placeholder: 'Walkthrough video coming soon',
};

export const TRUST_POINTS = [
  {
    title: 'Your key stays in this tab',
    body: "Stored in session storage, not on a server. Close the tab and it's gone.",
  },
  {
    title: 'Photos go straight to OpenAI',
    body: `Your browser talks to OpenAI directly. Nothing passes through ${ESTATE_FLOW_GLOBAL_NAME}. No tracking on this page.`,
  },
  {
    title: 'You pay OpenAI, not us',
    body: 'No subscription, no markup. Read every line of code on GitHub, or run your own copy.',
  },
];

export const MIDDLEMAN = {
  title: 'Most AI listing tools are a middleman.',
  body: "They take your photos, hand them to OpenAI, and charge you a markup per item. We removed the middleman. You pay OpenAI's actual price and see it before you run.",
  theirsLabel: 'Other AI listing tools',
  theirsSteps: ['Your photos', 'Middleman + markup', 'OpenAI'],
  oursLabel: 'This tool',
  oursSteps: ['Your photos', 'OpenAI'],
  perItem: 'per item',
  tableItems: 'Items',
  tableTypical: 'Typical AI listing tool',
  tableYou: 'You, with',
  tableSaved: `${ESTATE_FLOW_GLOBAL_NAME} just saved you`,
  youreWelcome: "You're welcome.",
  footnote:
    "Typical range: bulk credit pricing at the low end, popular ~100-item packages at the high end (those often include extras like photo enhancement). Your cost assumes one photo per item; OpenAI's actual bill varies with photo count and output length.",
};

export const AI_HONESTY = {
  title: 'AI writes great copy. It guesses at prices.',
  paragraphs: [
    "From a photo, AI can name the item, describe it and spot condition issues. It can't see what the same item actually sold for last week. So every price here is labeled for what it is: an estimate.",
    `When pricing matters, ${ESTATE_FLOW_GLOBAL_NAME} finds comps with Google Lens image search and puts eBay Sold listings one tap away so you can verify, right inside your sale workflow.`,
  ],
  cta: `See real comps in ${ESTATE_FLOW_GLOBAL_NAME}`,
  sample: {
    photo: 'Item photo',
    titleLabel: 'Title',
    title: 'Mid-Century Teak Sideboard, 4 Drawers, Sliding Doors',
    descriptionLabel: 'Description',
    description:
      'Low teak sideboard with four center drawers flanked by two sliding doors. Tapered legs, original pulls.',
    categoryLabel: 'Category',
    category: 'Furniture › Sideboards',
    conditionLabel: 'Condition',
    condition: 'Light surface wear on top',
    estimateLabel: 'AI estimate',
    estimate: '$[LOW] to $[HIGH]',
    estimateTag: 'Guess from photo, not sold data',
  },
};

export const USE_ON_SALE = {
  title: 'Use it on your sale',
  body: 'Your inventory, ready to print, share with your team or hand to a client.',
  items: [
    {
      title: 'Excel inventory',
      body: 'Every item with a thumbnail of your own photo. Sort, filter and edit.',
    },
    {
      title: 'Inventory estimate PDF',
      body: 'A clean printable report with photos, details and an estimated total.',
    },
    {
      title: 'Share with your team',
      body: 'Send the file to your crew or client. No account needed to open it.',
    },
  ],
};

export const ESTATE_FLOW_BAND = {
  eyebrow: `Bring your file to ${ESTATE_FLOW_GLOBAL_NAME}`,
  title: `AI is the small part. ${ESTATE_FLOW_GLOBAL_NAME} is everything else.`,
  paragraphs: [
    `We gave the AI part away because it's the easy part. ${ESTATE_FLOW_GLOBAL_NAME} is built for running the sale: real comps, inventory, listing and the field work in between.`,
    `${ESTATE_FLOW_GLOBAL_NAME} imports this exact Excel file. Sign up, drop it in, and your inventory is ready in minutes.`,
  ],
  cta: 'Sign up and import your file',
  note: 'Bring your Excel file to get started quickly.',
  features: [
    {
      title: 'Real comps, not guesses',
      body: 'Finds comps with Google Lens image search, with eBay Sold listings one tap away to verify.',
    },
    {
      title: 'Sell everywhere',
      body: 'Send items to your Square POS with printable barcodes, and sync to EstateSales.NET, LiveAuctioneers and more.',
    },
    {
      title: 'Run the sale from your phone',
      body: 'The iOS app for photos, pricing and inventory in the field.',
    },
  ],
};

export const FAQ = {
  title: 'Questions',
  items: [
    {
      q: 'Is my API key safe?',
      a: "It lives in your browser's session storage for this tab only. It's sent to OpenAI and nowhere else. This page runs no analytics or third-party scripts, and the source is public so you can check.",
    },
    {
      q: 'What does it cost?',
      a: 'Nothing from us. OpenAI bills your account per request, usually pennies per hundred items. You see an estimate before every run.',
    },
    {
      q: 'Why is the price only an estimate?',
      a: `AI sees the photo, not the market. Real pricing needs real market data. ${ESTATE_FLOW_GLOBAL_NAME} finds comps with Google Lens image search, and you can check eBay Sold listings in one tap.`,
    },
    {
      q: 'I have my Excel file. Now what?',
      a: `Share it with your team, print it, or use it to write your price stickers. Or import it into ${ESTATE_FLOW_GLOBAL_NAME} and unlock much more: comps, Square POS barcodes, syncing to sale sites, and the rest of running the sale.`,
    },
    {
      q: 'Can I run my own copy?',
      a: "Yes. It's MIT licensed and fully static. Fork it on GitHub and deploy anywhere.",
    },
  ],
};

export const FOOTER = {
  builtBy: 'Built by',
  license: 'MIT licensed.',
  github: 'GitHub',
};

export const SETTINGS = {
  title: 'Settings',
  saved: 'Saved in this browser.',
  imageQuality: {
    label: 'Photo size sent to AI',
    help: 'Photos are converted and shrunk in your browser before sending. Bigger costs more.',
    options: {
      small: { label: 'Smaller', description: '768px. Cheapest, fine for most items.' },
      balanced: { label: 'Balanced', description: '1024px. Recommended.' },
      detailed: {
        label: 'Detailed',
        description: "1536px. Better for labels and maker's marks. Costs more.",
      },
    },
  },
};

export const PHOTOS = {
  label: 'Item photos',
  dropTitle: 'Drop photos here, or choose files',
  dropActive: 'Drop to add',
  dropHint: 'JPG, PNG or HEIC.',
  takePhotos: 'Take photos',
  addMore: 'Add more',
  clearAll: 'Clear all',
  remove: 'Remove photo',
  failed: "Couldn't read this photo",
  summary: (count: number) => `${count} ${count === 1 ? 'photo' : 'photos'} ready`,
  processing: (done: number, total: number) => `Preparing ${done} of ${total}`,
  skipped: (count: number) =>
    `${count} ${count === 1 ? 'file was' : 'files were'} skipped (not a photo, too large, or over the limit).`,
};

export const ESTIMATE = {
  generate: (count: number) => `Generate ${count} ${count === 1 ? 'listing' : 'listings'}`,
  waiting: 'Preparing photos...',
  title: 'Before you run',
  yourCost: 'Your cost, using your own AI',
  competitor: 'Typical AI listing tool',
  savings: `${ESTATE_FLOW_GLOBAL_NAME} just saved you`,
  footnote: (model: string, low: string, high: string) =>
    `Using ${model}, billed by OpenAI to your account. Likely between ${low} and ${high} at current rates.`,
  confirm: 'Continue',
  cancel: 'Cancel',
};
