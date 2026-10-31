import { X } from 'lucide-react';
import { useState } from 'react';

import { CostConfirm } from '@/components/setup/CostConfirm';
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { getModel } from '@/config/models';
import { WIZARD } from '@/constants/copy';
import { useSettings } from '@/hooks/useSettings';
import { getApiKey } from '@/lib/apiKeyStorage';
import { cn } from '@/lib/utils';
import { useListingStore } from '@/store/listingStore';
import type { Photo } from '@/store/photoStore';
import { estimateCost } from '@/utils/costEstimator';

import { KeyStep } from './KeyStep';
import { ModelStep } from './ModelStep';
import { RunStep } from './RunStep';

type Step = 'key' | 'model' | 'cost' | 'run';
const PROGRESS_STEPS: Step[] = ['key', 'model', 'cost'];

/** Multi-step modal: connect AI, pick model, confirm cost, watch it run. */
export function GenerateWizard({
  open,
  onOpenChange,
  photos,
  onViewResults,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Photos that still need listings. */
  photos: Photo[];
  onViewResults: () => void;
}) {
  const [settings] = useSettings();
  const providerId = getModel(settings.modelId).provider;
  const start = useListingStore((s) => s.start);

  const [apiKey, setApiKey] = useState(() => getApiKey(providerId));
  const [step, setStep] = useState<Step>(() => (apiKey ? 'model' : 'key'));

  const estimate = estimateCost({
    modelId: settings.modelId,
    itemCount: photos.length,
    photoCount: photos.length,
    imageQuality: settings.imageQuality,
  });

  const handleOpenChange = (next: boolean) => onOpenChange(next);

  const confirm = () => {
    start(photos, { apiKey, modelId: settings.modelId });
    setStep('run');
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <div className="mb-5 flex items-start justify-between gap-4">
          <DialogTitle className="font-serif text-2xl">{WIZARD.steps[step]}</DialogTitle>
          <DialogClose
            aria-label={WIZARD.close}
            className="-mt-1 -mr-2 flex size-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
          >
            <X className="size-5" aria-hidden="true" />
          </DialogClose>
        </div>

        {step !== 'run' && (
          <div className="mb-6 grid grid-cols-3 gap-1.5" aria-hidden="true">
            {PROGRESS_STEPS.map((s, i) => (
              <span
                key={s}
                className={cn(
                  'h-1 rounded-full',
                  i <= PROGRESS_STEPS.indexOf(step) ? 'bg-accent-warm' : 'bg-muted'
                )}
              />
            ))}
          </div>
        )}

        {step === 'key' && (
          <KeyStep
            providerId={providerId}
            initialKey={apiKey}
            onDone={(key) => {
              setApiKey(key);
              setStep('model');
            }}
          />
        )}
        {step === 'model' && (
          <ModelStep providerId={providerId} onBack={() => setStep('key')} onNext={() => setStep('cost')} />
        )}
        {step === 'cost' && (
          <CostConfirm
            estimate={estimate}
            modelId={settings.modelId}
            itemCount={photos.length}
            onBack={() => setStep('model')}
            onConfirm={confirm}
          />
        )}
        {step === 'run' && (
          <RunStep
            onFixKey={() => setStep('key')}
            onView={() => {
              handleOpenChange(false);
              onViewResults();
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
