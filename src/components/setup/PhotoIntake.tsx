import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { PHOTOS } from '@/constants/copy';
import { usePhotoStore } from '@/store/photoStore';

import { PhotoDropzone } from './PhotoDropzone';
import { PhotoGrid } from './PhotoGrid';

/** Step 3 of the setup card: add, preview and remove photos. */
export function PhotoIntake({ step }: { step: number }) {
  const { photos, addFiles, removePhoto, clearPhotos } = usePhotoStore();
  const [skipped, setSkipped] = useState(0);

  const handleFiles = (files: File[]) => setSkipped(addFiles(files).skipped);

  const ready = photos.filter((p) => p.status === 'ready');
  const processing = photos.filter((p) => p.status === 'processing').length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium">
          {step}. {PHOTOS.label}
        </span>
        {photos.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => { clearPhotos(); setSkipped(0); }}>
            {PHOTOS.clearAll}
          </Button>
        )}
      </div>

      {photos.length > 0 && <PhotoGrid photos={photos} onRemove={removePhoto} />}
      <PhotoDropzone onFiles={handleFiles} compact={photos.length > 0} />

      <div aria-live="polite" className="flex flex-col gap-1 text-[13px] text-muted-foreground">
        {processing > 0 && <span>{PHOTOS.processing(photos.length - processing, photos.length)}</span>}
        {processing === 0 && ready.length > 0 && (
          <span>{PHOTOS.summary(ready.length)}</span>
        )}
        {skipped > 0 && <span className="text-danger-ink">{PHOTOS.skipped(skipped)}</span>}
      </div>
    </div>
  );
}
