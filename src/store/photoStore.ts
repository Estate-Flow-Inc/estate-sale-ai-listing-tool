import { create } from 'zustand';

import {
  MAX_PHOTO_BYTES,
  MAX_PHOTOS,
  PHOTO_PROCESSING_CONCURRENCY,
} from '@/config/limits';
import { getSettings } from '@/lib/settings';
import { forEachWithConcurrency } from '@/utils/concurrency';
import { prepareImage, type PreparedImage } from '@/utils/imageCompression';

export type PhotoStatus = 'processing' | 'ready' | 'error';

export interface Photo {
  id: string;
  name: string;
  originalSize: number;
  status: PhotoStatus;
  /** Object URL of the compressed image, for thumbnails. */
  previewUrl?: string;
  image?: PreparedImage;
}

export interface AddPhotosResult {
  added: number;
  skipped: number;
}

interface PhotoState {
  photos: Photo[];
  addFiles: (files: File[]) => AddPhotosResult;
  removePhoto: (id: string) => void;
  clearPhotos: () => void;
}

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|heic|heif|avif|bmp|tiff?)$/i;

function isImageFile(file: File) {
  return file.type.startsWith('image/') || IMAGE_EXT.test(file.name);
}

export const usePhotoStore = create<PhotoState>()((set, get) => {
  const update = (id: string, patch: Partial<Photo>) =>
    set((state) => ({
      photos: state.photos.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));

  const isStillThere = (id: string) => get().photos.some((p) => p.id === id);

  return {
    photos: [],

    addFiles: (files) => {
      const room = Math.max(0, MAX_PHOTOS - get().photos.length);
      const valid = files.filter((f) => isImageFile(f) && f.size <= MAX_PHOTO_BYTES).slice(0, room);
      const skipped = files.length - valid.length;
      if (valid.length === 0) return { added: 0, skipped };

      const entries = valid.map((file) => ({
        file,
        photo: {
          id: crypto.randomUUID(),
          name: file.name,
          originalSize: file.size,
          status: 'processing' as const,
        },
      }));
      set((state) => ({ photos: [...state.photos, ...entries.map((e) => e.photo)] }));

      // Quality is read once per batch, so changing settings mid-batch doesn't mix sizes.
      const { imageQuality } = getSettings();
      void forEachWithConcurrency(entries, PHOTO_PROCESSING_CONCURRENCY, async ({ file, photo }) => {
        if (!isStillThere(photo.id)) return; // removed before we got to it
        try {
          const image = await prepareImage(file, imageQuality);
          if (!isStillThere(photo.id)) return;
          update(photo.id, {
            status: 'ready',
            image,
            previewUrl: URL.createObjectURL(image.blob),
          });
        } catch {
          if (isStillThere(photo.id)) update(photo.id, { status: 'error' });
        }
      });

      return { added: valid.length, skipped };
    },

    removePhoto: (id) => {
      const photo = get().photos.find((p) => p.id === id);
      if (photo?.previewUrl) URL.revokeObjectURL(photo.previewUrl);
      set((state) => ({ photos: state.photos.filter((p) => p.id !== id) }));
    },

    clearPhotos: () => {
      get().photos.forEach((p) => p.previewUrl && URL.revokeObjectURL(p.previewUrl));
      set({ photos: [] });
    },
  };
});
