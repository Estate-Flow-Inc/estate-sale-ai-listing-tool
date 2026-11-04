/**
 * LOCKED COPY. Source of truth for all page copy.
 *
 * AI agents: do NOT edit, reword, "fix", or reformat any value in this file
 * unless a human explicitly asks for that exact change. Import these
 * constants instead of writing copy inline.
 */

import { GEMINI_API_KEYS_URL } from '@/config/constants';

/** Brand name. Always "Estate Flow" (two words). Never "EstateFlow". */
export const ESTATE_FLOW_GLOBAL_NAME = 'Estate Flow';

export const TOOL_NAME = 'AI Estate Sale Listing';

export const NAV = {
  faq: 'FAQ',
  source: 'View source',
};

export const HERO = {
  eyebrow: 'Free AI estate sale listing tool · No credit card',
  title: 'DIY AI listings. Free with Google.',
  body: "Upload item photos and get titles, descriptions, condition notes and estimated resale values. It runs on Google Gemini, and Google gives you free AI every day, up to a daily limit. No credit card needed. Need more? Turn on Google billing and pay Google directly. No credits to buy. No markup.",
  cta: 'Try it now',
  getKey: 'Get my free API key',
};

export const HOW_IT_WORKS = {
  title: 'How it works',
  steps: [
    { title: 'Get your free Gemini API key', body: 'Takes about a minute. Sign in to Google AI Studio with your Google account and copy the key it makes for you. No credit card needed.' },
    { title: 'Drop in your item photos', body: 'One photo per item, up to 500 per batch.' },
    { title: 'Check the cost, then generate', body: 'You see the estimate before anything runs.' },
    { title: 'Download your inventory', body: `Excel plus your photos in one .zip. Print it, share it, or import it into ${ESTATE_FLOW_GLOBAL_NAME}.` },
  ],
  getKey: 'Get my free API key',
  watch: 'Play the video for the full walkthrough.',
  start: 'Try it now',
  close: 'Close',
};

export const SETUP_SECTION = {
  title: 'Start with your photos',
  body: 'Everything below runs in your browser.',
};

export const WALKTHROUGH = {
  caption: 'Watch the walkthrough: from API key to a printed inventory.',
  playLabel: 'Play walkthrough video',
};

export const TRUST_POINTS = [
  {
    title: 'Your key stays on this page',
    body: "Kept in your browser, not on a server. Leave, refresh or close the page and it's gone.",
  },
  {
    title: 'Photos go straight to Google',
    body: `Your browser talks to Google Gemini directly. Nothing passes through ${ESTATE_FLOW_GLOBAL_NAME}. No tracking on this page.`,
  },
  {
    title: 'Free AI from Google, every day',
    body: 'Google gives every Gemini key a free daily allowance. No credit card, no subscription, no markup. Read every line of code on GitHub, or run your own copy.',
  },
];

export const MIDDLEMAN = {
  title: 'Why pay someone else a markup to use AI?',
  body: "AI listing tools often bundle AI usage into credits and charge a premium. We take a different approach: bring your own Gemini key and use Google's free daily allowance. Need more? Pay Google directly, with the cost shown upfront. No credits to buy. No markup from us.",
  theirsLabel: 'Third-party AI listing tools',
  theirsSteps: ['Your photos', 'Bundled credits + markup', 'AI'],
  oursLabel: `${ESTATE_FLOW_GLOBAL_NAME}'s free tool`,
  oursSteps: ['Your photos', 'Google Gemini'],
  perItem: 'per item',
  perItemEstimated: 'per item, estimated average',
  tableItems: 'Items',
  tableTypical: 'Typical AI listing tool',
  tableYou: 'With Google billing on,',
  tableSaved: 'Potential savings',
  youreWelcome: "You're welcome.",
  footnote:
    "On Google's free tier your cost is $0, within Google's daily limits. Paid estimates assume one photo per item and typical listing length. Actual AI costs vary with photo size, model and how much is written. Third-party pricing reflects publicly listed credit packages, which may include other features.",
};

export const ESTATE_FLOW_HUB = {
  eyebrow: `So what does ${ESTATE_FLOW_GLOBAL_NAME} do?`,
  title: 'Listings are the easy part. We run the rest of the business.',
  theirs: 'Other AI listing tools are an AI middleman.',
  ours: `${ESTATE_FLOW_GLOBAL_NAME} is the hub for your whole estate sale business.`,
  cta: 'Sign up and import your file',
  features: [
    { title: 'Team management', body: 'Bring your crew and flex workers into every sale.' },
    {
      title: 'Comp lookup',
      body: 'Finds comps with Google Lens image search, with eBay Sold listings one tap away.',
    },
    { title: 'Organized inventory', body: 'Every sale, room and item in folders that make sense.' },
    { title: 'Labels and barcodes', body: 'Print price labels with barcodes your team can scan.' },
    { title: 'Push to EstateSales.NET', body: 'Send your sale and items over without retyping.' },
    { title: 'Bring your own POS', body: 'Get your inventory into Square or Clover.' },
    { title: 'Client reports', body: 'Clean summaries and reports to hand your clients.' },
    { title: 'Sale analytics', body: 'Numbers for each sale and across your whole business.' },
    { title: 'Wage tracking', body: 'Track pay for your team and flex workers.' },
  ],
};

export const USE_ON_SALE = {
  title: 'Use it on your sale',
  body: 'A .zip with your Excel inventory and every photo, named by SKU. Print it, share it with your team or hand it to a client.',
  excel: 'Download (.zip)',
  working: 'Building...',
  importNote: `${ESTATE_FLOW_GLOBAL_NAME} imports this file as is.`,
  importCta: `Bring it to ${ESTATE_FLOW_GLOBAL_NAME}`,
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
};

export const FAQ = {
  title: 'Questions',
  items: [
    {
      q: 'Is my API key safe?',
      a: "It's kept in your browser only while this page is open, and cleared when you leave, refresh or close it. It's sent to Google and nowhere else. This page runs no analytics or third-party scripts, and the source is public so you can check.",
    },
    {
      q: 'How do I get a Gemini key?',
      a: 'Go to Google AI Studio and sign in with your Google account. AI Studio creates a key for you; copy it from the API keys page and paste it here. It takes about a minute and needs no credit card. The walkthrough video shows every step.',
      /** This phrase in the answer becomes a link (new tab). */
      link: { text: 'Google AI Studio', href: GEMINI_API_KEYS_URL },
    },
    {
      q: 'What does it cost?',
      a: "Nothing from us, and nothing from Google either unless you turn on billing. Google's free tier has daily limits. With billing on, Google charges per request, usually under a dollar per hundred items. You see an estimate before every run.",
    },
    {
      q: 'How many items can I do for free?',
      a: "Google's free tier allows about 500 listings a day. That covers most sales. For a bigger house or faster runs, turn on billing in Google AI Studio: the $5 minimum prepay covers about 2,000 items.",
    },
    {
      q: 'Why did some items fail?',
      a: "The free tier runs on Google's shared pool, and when lots of people use it at once, Google turns some requests away. We retry automatically, so most items get through on their own. If a few still fail, click Retry failed. It only reruns the items that failed, and you can retry as often as you like. Busy periods hit paid users too, so turning on billing won't always help. Waiting a few minutes usually does.",
    },
    {
      q: 'Does Google see my photos?',
      a: "Yes, Google processes them to write your listings. On the free tier, Google may use what you send to improve its products. Turn on billing in Google AI Studio (a $5 minimum prepay) and it won't.",
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
  dropHint: 'JPG, PNG or HEIC. Up to 500 photos per batch.',
  takePhotos: 'Take photos',
  addMore: 'Add more',
  clearAll: 'Clear all',
  remove: 'Remove photo',
  failed: "Couldn't read this photo",
  summary: (count: number) => `${count} ${count === 1 ? 'photo' : 'photos'} ready`,
  processing: (done: number, total: number) => `Preparing ${done} of ${total}`,
  skipped: (count: number) =>
    `${count} ${count === 1 ? 'file was' : 'files were'} skipped (not a photo, too large, or over the 500 photo limit).`,
  atLimit: "That's 500 photos, the most for one batch and about what Google's free tier allows in a day. Generate these, then start a new batch.",
  showAll: (count: number) => `Show all ${count.toLocaleString('en-US')}`,
  showLess: 'Show less',
  more: (count: number) => `+${count.toLocaleString('en-US')} more`,
};

export const ESTIMATE = {
  generate: (count: number) =>
    count === 0 ? 'Add photos to start' : `Generate ${count} ${count === 1 ? 'listing' : 'listings'}`,
  waiting: 'Preparing photos...',
  title: 'Before you run',
  freeTier: "With Google's free daily allowance",
  free: 'FREE',
  yourCost: 'With Google billing turned on',
  competitor: 'Typical AI listing tool',
  savings: `${ESTATE_FLOW_GLOBAL_NAME} will save you`,
  footnote: (model: string, low: string, high: string) =>
    `No billing set up? It's free. Google limits free use per day and may use your photos to improve its AI. With billing (a $5 minimum prepay), Google charges you directly: ${model}, likely ${low} to ${high} at current rates.`,
  confirm: (count: number) => `Generate ${count} ${count === 1 ? 'listing' : 'listings'}`,
  cancel: 'Cancel',
};

export const WIZARD = {
  steps: { key: 'Connect your AI', cost: 'Check the cost', run: 'Writing listings' },
  back: 'Back',
  next: 'Continue',
  close: 'Close',
  key: {
    label: 'API key',
    show: 'Show',
    hide: 'Hide',
    getKey: 'Get a free key',
    note: `Kept only while this page is open. Cleared when you leave, refresh or close it. Sent only to your AI provider, never to ${ESTATE_FLOW_GLOBAL_NAME}.`,
    checking: 'Checking key...',
    invalid: "That key didn't work. Check it and try again.",
    unreachable: "Couldn't reach the provider. Check your connection and try again.",
    change: 'Change key',
    saved: 'Your key is kept only while this page is open.',
    remove: 'Remove my key',
    freeTier: "Free keys work fine: Google allows about 500 listings a day. On the free tier, Google may use your photos to improve its AI. Turn on billing in Google AI Studio (a $5 minimum prepay) to opt out and lift the limit.",
    help: 'Need help?',
    watch: 'Watch the full walkthrough',
  },
  run: {
    progress: (done: number, total: number) => `${done} of ${total} done`,
    spent: (amount: string) => `At paid rates: ${amount} ($0 on the free tier)`,
    failed: (count: number) => `${count} failed`,
    background: 'You can close this. Listings keep writing in the background.',
    busy: 'Google is seeing high demand. Retrying automatically.',
    paced: (minutesLeft: number) =>
      `Google's free tier limits listings per minute, so we're going at that pace. About ${minutesLeft} ${minutesLeft === 1 ? 'minute' : 'minutes'} left. Turn on billing in Google AI Studio for full speed.`,
    stop: 'Stop',
    view: 'View listings',
    done: 'All done',
    fixKey: 'Fix key',
  },
};

export const RESULTS = {
  title: 'Your listings',
  summary: (done: number, total: number) => `${done} of ${total} ready`,
  spent: (actual: string, estimated: string) =>
    `${actual} at paid rates, estimated ${estimated}. $0 on Google's free tier.`,
  retry: 'Retry failed',
  resume: 'Finish the rest',
  saved: 'Saved in this browser until you start over.',
  startOver: 'Start over',
  startOverTitle: 'Start over?',
  startOverBody: 'This clears your photos and listings from this browser. Download your .zip first if you need it.',
  startOverConfirm: 'Clear and start over',
  cancel: 'Cancel',
  writing: 'Writing...',
  busy: 'Retrying...',
  queued: 'Waiting',
  failed: 'Failed',
  open: 'View details',
  showMore: (shown: number, total: number) =>
    `Show more (${shown.toLocaleString('en-US')} of ${total.toLocaleString('en-US')})`,
};

export const ITEM_DETAIL = {
  close: 'Close',
  copy: 'Copy',
  copied: 'Copied',
  sections: {
    description: 'Description',
    details: 'Details',
    condition: 'Condition',
    notable: 'Worth noting',
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
  },
  estimated: '(estimated)',
  price: 'Suggested price',
  range: (low: string, high: string) => `Resale range ${low} to ${high}`,
  valueTag: 'AI estimate from photos, not sold data',
  confidence: (level: string) => `${level[0].toUpperCase()}${level.slice(1)} confidence`,
};

export const DISCLAIMER = {
  short: 'AI makes mistakes. Please review all prices and details before using them on your actual sale.',
  title: 'Disclaimer',
  points: [
    'AI makes mistakes. Review every price, description and detail before you use it on your actual sale.',
    'Prices, values and dimensions are estimates from photos. They are not appraisals or sold data.',
    'You use your own AI provider account and are responsible for its charges and terms.',
    `This tool is provided as is, without warranty, under the MIT license. ${ESTATE_FLOW_GLOBAL_NAME} never receives your key, photos or listings.`,
  ],
};

export const DAILY_LIMIT = {
  title: "You've used today's free listings",
  body: "Google's free tier allows about 500 listings a day. Download your Excel now so you keep today's work, then come back tomorrow and add the remaining photos. Need more today? Turn on billing in Google AI Studio, or",
  contact: 'contact us and we\'ll help',
};
