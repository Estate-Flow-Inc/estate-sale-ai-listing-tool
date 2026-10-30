import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ESTIMATE } from '@/constants/copy';
import { useSettings } from '@/hooks/useSettings';
import { usePhotoStore } from '@/store/photoStore';
import { estimateCost } from '@/utils/costEstimator';

import { CostConfirm } from './CostConfirm';
import { PhotoIntake } from './PhotoIntake';

/**
 * Setup card: key, model, photos, cost check, generate.
 * Key and model are placeholders until their steps are built.
 */
export function SetupCard() {
  const [settings] = useSettings();
  const photos = usePhotoStore((s) => s.photos);
  const [confirming, setConfirming] = useState(false);

  const ready = photos.filter((p) => p.status === 'ready').length;
  const processing = photos.some((p) => p.status === 'processing');

  // One photo per item until grouping exists.
  const estimate = estimateCost({
    modelId: settings.modelId,
    itemCount: ready,
    photoCount: ready,
    imageQuality: settings.imageQuality,
  });

  const handleConfirm = () => {
    setConfirming(false);
    // TODO: start generation (next step).
  };

  return (
    <div className="flex flex-col gap-7 rounded-2xl border border-border bg-card p-5 sm:p-7">
      <span className="text-sm font-medium">1. Your OpenAI API key</span>
      <span className="text-sm font-medium">2. Model</span>
      <PhotoIntake step={3} />

      {confirming && ready > 0 ? (
        <CostConfirm
          estimate={estimate}
          modelId={settings.modelId}
          onConfirm={handleConfirm}
          onCancel={() => setConfirming(false)}
        />
      ) : (
        <Button size="xl" disabled={ready === 0 || processing} onClick={() => setConfirming(true)}>
          {processing ? ESTIMATE.waiting : ESTIMATE.generate(ready)}
        </Button>
      )}
    </div>
  );
}
