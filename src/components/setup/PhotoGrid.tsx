import { CircleAlert, Loader2, X } from 'lucide-react';

import { PHOTOS } from '@/constants/copy';
import type { Photo } from '@/store/photoStore';

/** Thumbnails of added photos with per-photo status and a remove button. */
export function PhotoGrid({ photos, onRemove }: { photos: Photo[]; onRemove: (id: string) => void }) {
  return (
    <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6">
      {photos.map((photo) => (
        <li key={photo.id} className="group relative aspect-square overflow-hidden rounded-lg bg-[#e9e4db]">
          {photo.status === 'ready' && photo.previewUrl && (
            <img src={photo.previewUrl} alt={photo.name} loading="lazy" className="size-full object-cover" />
          )}
          {photo.status === 'processing' && (
            <span className="flex size-full items-center justify-center">
              <Loader2 className="size-5 animate-spin text-muted-foreground" aria-label={photo.name} />
            </span>
          )}
          {photo.status === 'error' && (
            <span
              className="flex size-full flex-col items-center justify-center gap-1 p-1 text-center text-[11px] text-danger-ink"
              title={photo.name}
            >
              <CircleAlert className="size-4" aria-hidden="true" />
              {PHOTOS.failed}
            </span>
          )}
          <button
            type="button"
            onClick={() => onRemove(photo.id)}
            aria-label={`${PHOTOS.remove}: ${photo.name}`}
            className="absolute top-1 right-1 flex size-7 items-center justify-center rounded-full bg-charcoal/70 text-white opacity-100 transition-opacity focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
  );
}
