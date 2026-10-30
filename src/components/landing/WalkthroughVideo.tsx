import { Play } from 'lucide-react';
import { useState } from 'react';

import { WALKTHROUGH_YOUTUBE_ID } from '@/config/constants';
import { TOOL_NAME, WALKTHROUGH } from '@/constants/copy';

/** Click-to-load YouTube embed, so nothing from YouTube loads until the visitor asks. */
export function WalkthroughVideo() {
  const [playing, setPlaying] = useState(false);
  const hasVideo = WALKTHROUGH_YOUTUBE_ID.length > 0;

  return (
    <figure className="flex flex-col gap-3">
      <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl bg-charcoal">
        {playing && hasVideo ? (
          <iframe
            className="absolute inset-0 size-full"
            src={`https://www.youtube-nocookie.com/embed/${WALKTHROUGH_YOUTUBE_ID}?autoplay=1&rel=0`}
            title={`${TOOL_NAME} walkthrough`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : hasVideo ? (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={WALKTHROUGH.playLabel}
            className="flex size-20 items-center justify-center rounded-full bg-warm-bg transition-transform hover:scale-105"
          >
            <Play className="size-7 fill-charcoal text-charcoal" aria-hidden="true" />
          </button>
        ) : (
          <span className="text-sm text-warm-bg/70">{WALKTHROUGH.placeholder}</span>
        )}
      </div>
      <figcaption className="text-center text-sm text-muted-foreground">{WALKTHROUGH.caption}</figcaption>
    </figure>
  );
}
