import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { GenerateWizard } from '@/components/wizard/GenerateWizard';
import { getModel } from '@/config/models';
import { ESTIMATE, WIZARD } from '@/constants/copy';
import { useSettings } from '@/hooks/useSettings';
import { useApiKey } from '@/hooks/useApiKey';
import { clearApiKey } from '@/lib/apiKeyStorage';
import { unlistedPhotos, useListingStore } from '@/store/listingStore';
import { usePhotoStore } from '@/store/photoStore';

import { PhotoIntake } from './PhotoIntake';

/** Photos first. Everything technical happens in the wizard modal. */
export function SetupCard() {
  const photos = usePhotoStore((s) => s.photos);
  const items = useListingStore((s) => s.items);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [settings] = useSettings();
  const providerId = getModel(settings.modelId).provider;
  const hasKey = Boolean(useApiKey(providerId));

  const removeKey = () => clearApiKey(providerId);

  const pending = unlistedPhotos(photos, items);
  const processing = photos.some((p) => p.status === 'processing');

  const viewResults = () =>
    document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-5 sm:p-7">
      <PhotoIntake />
      <Button
        size="xl"
        disabled={pending.length === 0 || processing}
        onClick={() => setWizardOpen(true)}
      >
        {processing ? ESTIMATE.waiting : ESTIMATE.generate(pending.length)}
      </Button>
      {hasKey && (
        <p className="-mt-3 text-center text-[13px] text-muted-foreground">
          {WIZARD.key.saved}{' '}
          <button
            type="button"
            onClick={removeKey}
            className="font-medium text-accent-ink underline-offset-2 hover:underline"
          >
            {WIZARD.key.remove}
          </button>
        </p>
      )}
      {/* Mounted only while open, so each opening starts fresh. */}
      {wizardOpen && (
        <GenerateWizard
          open={wizardOpen}
          onOpenChange={setWizardOpen}
          photos={pending}
          onViewResults={viewResults}
        />
      )}
    </div>
  );
}
