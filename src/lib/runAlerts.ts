import { RUN_ALERTS } from '@/constants/copy';
import { useListingStore } from '@/store/listingStore';

/**
 * Lets people leave the tab while listings write: progress in the tab title,
 * and a soft chime when the run finishes. Browser only.
 */

let audio: AudioContext | null = null;

/** Call from a click (Generate), so the browser allows the chime later. */
export function unlockChime() {
  try {
    audio ??= new AudioContext();
    void audio.resume();
  } catch {
    audio = null; // no Web Audio: the tab title still updates
  }
}

function playChime() {
  if (!audio) return;
  const start = audio.currentTime + 0.05;
  // Two soft notes, a fifth apart.
  [659.25, 987.77].forEach((freq, i) => {
    const osc = audio!.createOscillator();
    const gain = audio!.createGain();
    const t = start + i * 0.18;
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
    osc.connect(gain).connect(audio!.destination);
    osc.start(t);
    osc.stop(t + 1);
  });
}

export function watchRunForAlerts() {
  const baseTitle = document.title;

  const restoreWhenSeen = () => {
    if (document.visibilityState === 'visible' && !useListingStore.getState().running) {
      document.title = baseTitle;
    }
  };
  document.addEventListener('visibilitychange', restoreWhenSeen);

  useListingStore.subscribe((s, prev) => {
    if (s.running) {
      const done = s.items.filter((i) => i.status === 'done' || i.status === 'error').length;
      document.title = RUN_ALERTS.progressTitle(done, s.items.length);
      return;
    }
    if (!prev.running) return;

    // Run just ended. Chime only if it finished on its own (not Stop) with something to show.
    const stopped = s.items.some((i) => i.status === 'queued');
    const done = s.items.filter((i) => i.status === 'done').length;
    if (!stopped && done > 0) {
      playChime();
      if (document.visibilityState === 'hidden') {
        document.title = RUN_ALERTS.doneTitle(done);
        return; // restored when they come back
      }
    }
    document.title = baseTitle;
  });
}
