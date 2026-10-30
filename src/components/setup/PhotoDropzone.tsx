import { Camera, Upload } from 'lucide-react';
import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { ACCEPTED_IMAGE_TYPES } from '@/config/limits';
import { PHOTOS } from '@/constants/copy';
import { cn } from '@/lib/utils';

/**
 * Drag-and-drop zone that is also a file picker, plus a camera button on phones.
 * `compact` shrinks it once photos are added.
 */
export function PhotoDropzone({
  onFiles,
  compact = false,
}: {
  onFiles: (files: File[]) => void;
  compact?: boolean;
}) {
  const [dragging, setDragging] = useState(false);
  // dragenter/dragleave fire for every child element; count them to know when we truly left.
  const depth = useRef(0);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) onFiles(files);
    e.target.value = ''; // allow picking the same files again
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    depth.current = 0;
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) onFiles(files);
  };

  return (
    <div className="flex flex-col gap-2">
      <label
        onDragEnter={(e) => {
          e.preventDefault();
          depth.current += 1;
          setDragging(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => {
          depth.current -= 1;
          if (depth.current <= 0) setDragging(false);
        }}
        onDrop={handleDrop}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed p-4 text-center transition-colors focus-within:ring-3 focus-within:ring-ring/50',
          compact ? 'min-h-24' : 'min-h-52',
          dragging ? 'border-accent-warm bg-[#faf7f2]' : 'border-[#c9c2b6] bg-[#faf9f7] hover:bg-[#f7f4ef]'
        )}
      >
        <Upload className={cn('text-accent-ink', compact ? 'size-5' : 'size-7')} aria-hidden="true" />
        <span className={cn('font-medium', compact ? 'text-sm' : 'text-[15px]')}>
          {dragging ? PHOTOS.dropActive : compact ? PHOTOS.addMore : PHOTOS.dropTitle}
        </span>
        {!compact && <span className="text-[13px] text-muted-foreground">{PHOTOS.dropHint}</span>}
        <input
          type="file"
          multiple
          accept={ACCEPTED_IMAGE_TYPES}
          onChange={handleInput}
          className="sr-only"
        />
      </label>

      {/* Phones: open the camera directly. */}
      <label className={cn(buttonVariants({ variant: 'outline', size: 'xl' }), 'cursor-pointer sm:hidden')}>
        <Camera aria-hidden="true" />
        {PHOTOS.takePhotos}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleInput}
          className="sr-only"
        />
      </label>
    </div>
  );
}
