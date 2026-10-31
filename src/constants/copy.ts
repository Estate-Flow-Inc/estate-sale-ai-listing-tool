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
  tryItNow: 'Try it now',
  faq: 'FAQ',
  source: 'View source',
  tryEstateFlow: `Try ${ESTATE_FLOW_GLOBAL_NAME}`,
};

export const HERO = {
  eyebrow: 'Free · Open source · No account',
  title: 'DIY AI listings. Pay for AI directly.',
  body: 'Upload item photos and get titles, descriptions, condition notes and estimated resale values. Use your own OpenAI key and pay OpenAI directly. No credits to buy. No markup.',
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
    title: 'Your AI. Your API key. Your money.',
    body: 'No subscription, no markup. Read every line of code on GitHub, or run your own copy.',
  },
];

export const MIDDLEMAN = {
  title: 'Why pay someone else a markup to use AI?',
  body: 'AI listing tools often bundle AI usage into credits and charge a premium. We take a different approach: bring your own OpenAI key, see the estimated cost upfront, and pay OpenAI directly. No credits to buy. No markup from us.',
  theirsLabel: 'Third-party AI listing tools',
  theirsSteps: ['Your photos', 'Bundled credits + markup', 'AI'],
  oursLabel: `${ESTATE_FLOW_GLOBAL_NAME}'s free tool`,
  oursSteps: ['Your photos', 'OpenAI'],
  perItem: 'per item',
  perItemEstimated: 'per item, estimated average',
  tableItems: 'Items',
  tableTypical: 'Typical AI listing tool',
  tableYou: 'Your cost with',
  tableSaved: 'Potential savings',
  youreWelcome: "You're welcome.",
  footnote:
    'Estimates assume one photo per item and typical listing length. Actual AI costs vary with photo size, model and how much is written. Third-party pricing reflects publicly listed credit packages, which may include other features.',
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
  savings: `${ESTATE_FLOW_GLOBAL_NAME} will save you`,
  footnote: (model: string, low: string, high: string) =>
    `Using ${model}, billed by OpenAI to your account. Likely between ${low} and ${high} at current rates.`,
  confirm: (count: number) => `Generate ${count} ${count === 1 ? 'listing' : 'listings'}`,
  cancel: 'Cancel',
};

export const WIZARD = {
  steps: { key: 'Connect your AI', model: 'Pick a model', cost: 'Check the cost', run: 'Writing listings' },
  back: 'Back',
  next: 'Continue',
  close: 'Close',
  key: {
    providerLabel: 'AI provider',
    comingSoon: 'Coming soon',
    label: 'API key',
    show: 'Show',
    hide: 'Hide',
    getKey: 'Get a key',
    note: `Saved in this browser tab only and cleared when you close it. Sent only to your AI provider, never to ${ESTATE_FLOW_GLOBAL_NAME}.`,
    checking: 'Checking key...',
    invalid: "That key didn't work. Check it and try again.",
    unreachable: "Couldn't reach the provider. Check your connection and try again.",
    change: 'Change key',
  },
  model: {
    help: 'Cost per 100 items at your photo size.',
    recommended: 'Recommended',
    per100: 'per 100 items',
    descriptions: {
      'gpt-5.6-luna': 'Cheapest. Great for most items.',
      'gpt-5.4-mini': 'A bit sharper on brands and details.',
      'gpt-5.6-terra': 'Most detailed. For valuable or tricky items.',
    } as Record<string, string>,
  },
  run: {
    progress: (done: number, total: number) => `${done} of ${total} done`,
    spent: (amount: string) => `Spent so far: ${amount}`,
    failed: (count: number) => `${count} failed`,
    background: 'You can close this. Listings keep writing in the background.',
    stop: 'Stop',
    view: 'View listings',
    done: 'All done',
    fixKey: 'Fix key',
  },
};

export const RESULTS = {
  title: 'Your listings',
  summary: (done: number, total: number) => `${done} of ${total} ready`,
  spent: (actual: string, estimated: string) => `Spent ${actual} (estimated ${estimated})`,
  retry: 'Retry failed',
  writing: 'Writing...',
  queued: 'Waiting',
  failed: 'Failed',
  open: 'View details',
};

export const ITEM_DETAIL = {
  close: 'Close',
  copy: 'Copy',
  copied: 'Copied',
  sections: {
    description: 'Description',
    details: 'Details',
    condition: 'Condition',
    shipping: 'Shipping',
    notable: 'Worth noting',
    verify: 'Check before you sell',
    keywords: 'Keywords',
  },
  labels: {
    title: 'Title',
    brand: 'Brand',
    make: 'Make',
    model: 'Model',
    color: 'Color',
    materials: 'Materials',
    style: 'Style',
    era: 'Era',
    dimensions: 'Dimensions',
    weight: 'Weight',
  },
  estimated: '(estimated)',
  value: 'Estimated resale value',
  valueTag: 'AI estimate from photos, not sold data',
  confidence: (level: string) => `${level[0].toUpperCase()}${level.slice(1)} confidence`,
  shippingNote: 'Rough estimate. Get a real quote before you promise a price.',
  pickupOnly: 'Local pickup only',
  upsell: `Want real comps? ${ESTATE_FLOW_GLOBAL_NAME} finds them with Google Lens image search.`,
  upsellCta: `Try ${ESTATE_FLOW_GLOBAL_NAME}`,
};
