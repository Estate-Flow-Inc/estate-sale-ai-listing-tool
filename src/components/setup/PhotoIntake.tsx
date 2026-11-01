import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { MAX_PHOTOS, PHOTO_GRID_PREVIEW } from '@/config/limits';
import { PHOTOS } from '@/constants/copy';
import { usePhotoStore } from '@/store/photoStore';

import { PhotoDropzone } from './PhotoDropzone';
import { PhotoGrid } from './PhotoGrid';

/** Add, preview and remove photos. Long batches collapse to two rows. */
export function PhotoIntake() {
  const { photos, addFiles, removePhoto, clearPhotos } = usePhotoStore();
  const [skipped, setSkipped] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const handleFiles = (files: File[]) => setSkipped(addFiles(files).skipped);

  const ready = photos.filter((p) => p.status === 'ready');
  const processing = photos.filter((p) => p.status === 'processing').length;
  const hidden = photos.length - PHOTO_GRID_PREVIEW;
  const visible = expanded ? photos : photos.slice(0, PHOTO_GRID_PREVIEW);
  const atLimit = photos.length >= MAX_PHOTOS;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium">{PHOTOS.label}</span>
        {photos.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clearPhotos();
              setSkipped(0);
              setExpanded(false);
            }}
          >
            {PHOTOS.clearAll}
          </Button>
        )}
      </div>

      {photos.length > 0 && <PhotoGrid photos={visible} onRemove={removePhoto} />}
      {hidden > 0 && (
        <Button variant="outline" className="self-center" onClick={() => setExpanded((e) => !e)}>
          {expanded ? PHOTOS.showLess : `${PHOTOS.more(hidden)} · ${PHOTOS.showAll(photos.length)}`}
        </Button>
      )}

      {!atLimit && <PhotoDropzone onFiles={handleFiles} compact={photos.length > 0} />}

      <div aria-live="polite" className="flex flex-col gap-1 text-[13px] text-muted-foreground">
        {processing > 0 && <span>{PHOTOS.processing(photos.length - processing, photos.length)}</span>}
        {processing === 0 && ready.length > 0 && <span>{PHOTOS.summary(ready.length)}</span>}
        {atLimit && <span className="text-foreground">{PHOTOS.atLimit}</span>}
        {skipped > 0 && <span className="text-danger-ink">{PHOTOS.skipped(skipped)}</span>}
      </div>
    </div>
  );
}
