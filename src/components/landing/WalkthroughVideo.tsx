import { Play } from 'lucide-react';
import { useState } from 'react';

import {
  WALKTHROUGH_POSTER,
  WALKTHROUGH_PREVIEW_MP4,
  WALKTHROUGH_YOUTUBE_ID,
} from '@/config/constants';
import { TOOL_NAME, WALKTHROUGH } from '@/constants/copy';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Poster (or a short muted loop) with a play button. Clicking loads the full
 * YouTube walkthrough, so nothing from YouTube loads until the visitor asks.
 */
export function WalkthroughVideo() {
  const [playing, setPlaying] = useState(false);
  const hasVideo = WALKTHROUGH_YOUTUBE_ID.length > 0;
  const showLoop = Boolean(WALKTHROUGH_PREVIEW_MP4) && !prefersReducedMotion();

  return (
    <figure className="flex flex-col gap-3">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-charcoal shadow-lg ring-1 ring-black/5">
        {playing && hasVideo ? (
          <iframe
            className="absolute inset-0 size-full"
            src={`https://www.youtube-nocookie.com/embed/${WALKTHROUGH_YOUTUBE_ID}?autoplay=1&rel=0`}
            title={`${TOOL_NAME} walkthrough`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            {showLoop ? (
              <video
                className="absolute inset-0 size-full object-cover"
                src={WALKTHROUGH_PREVIEW_MP4}
                poster={WALKTHROUGH_POSTER}
                autoPlay
                muted
                loop
                playsInline
                aria-hidden="true"
              />
            ) : (
              <img
                src={WALKTHROUGH_POSTER}
                alt=""
                className="absolute inset-0 size-full object-cover"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            )}
            <span className="absolute inset-0 bg-charcoal/15" aria-hidden="true" />
            <button
              type="button"
              onClick={() => hasVideo && setPlaying(true)}
              aria-label={WALKTHROUGH.playLabel}
              aria-disabled={!hasVideo}
              className="absolute top-1/2 left-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-warm-bg/95 shadow-xl transition-transform hover:scale-105"
            >
              <Play className="ml-1 size-7 fill-charcoal text-charcoal" aria-hidden="true" />
            </button>
          </>
        )}
      </div>
      <figcaption className="text-center text-sm text-muted-foreground">{WALKTHROUGH.caption}</figcaption>
    </figure>
  );
}
