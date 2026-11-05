/** External links and IDs. Update here, never inline. */

const ESTATE_FLOW_URL = 'https://joinestateflow.com';

/** Where the sign-up calls to action go (path on ESTATE_FLOW_URL). */
const ESTATE_FLOW_SIGNUP_PATH = '/';

/**
 * Every link to Estate Flow carries UTM tags so Estate Flow's analytics can count
 * visitors and signups that came from this tool. No tracking happens on this page:
 * the tags are just part of the link. `placement` says which link was clicked.
 */
export type EstateFlowLinkPlacement =
  | 'logo'
  | 'footer'
  | 'hub_cta'
  | 'band_cta'
  | 'export_panel'
  | 'daily_limit';

export function estateFlowLink(placement: EstateFlowLinkPlacement, signup = false, path?: string) {
  const url = new URL(path ?? (signup ? ESTATE_FLOW_SIGNUP_PATH : '/'), ESTATE_FLOW_URL);
  url.searchParams.set('utm_source', 'ai-listing-tool');
  url.searchParams.set('utm_medium', 'referral');
  url.searchParams.set('utm_campaign', 'free-tool');
  url.searchParams.set('utm_content', placement);
  return url.toString();
}

/** Estate Flow's contact page, for people who hit Google's free limit and want help. */
export const ESTATE_FLOW_CONTACT_URL = estateFlowLink('daily_limit', false, '/contact');

export const GITHUB_REPO_URL = 'https://github.com/Estate-Flow-Inc/estate-sale-ai-listing-tool';

/** Google AI Studio: sign in with a Google account and create a key. */
export const GEMINI_API_KEYS_URL = 'https://aistudio.google.com/app/apikey';

/** YouTube video ID for the full walkthrough. Empty: the play button does nothing yet. */
export const WALKTHROUGH_YOUTUBE_ID = 'qHUtN4sEJyk';

/** Still image shown before play (1280x720 screenshot), in /public. */
export const WALKTHROUGH_POSTER = `${import.meta.env.BASE_URL}walkthrough-poster.jpg`;

/** Optional short muted loop shown before play, in /public. Empty: poster only. */
export const WALKTHROUGH_PREVIEW_MP4 = `${import.meta.env.BASE_URL}walkthrough-preview.mp4`;

/** Full video on YouTube, for "Need help?" links. Empty until the ID is set. */
export const WALKTHROUGH_YOUTUBE_URL = WALKTHROUGH_YOUTUBE_ID
  ? `https://www.youtube.com/watch?v=${WALKTHROUGH_YOUTUBE_ID}`
  : '';
