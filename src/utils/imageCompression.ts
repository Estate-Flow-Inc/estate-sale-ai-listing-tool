import { DISPLAY_THUMB_PX } from '@/config/limits';
import { IMAGE_QUALITY_PRESETS, type ImageQuality } from '@/config/settings';

/**
 * Convert and compress photos in the browser before they go to the AI.
 * Everything runs on a canvas: no uploads, no CDN workers.
 * Adapted from estate-flow/web utils/imageCompression.ts and inventoryThumbnails.ts.
 */

export interface PreparedImage {
  /** Compressed JPEG sent to the AI. Kept as a Blob (not base64) to save memory. */
  blob: Blob;
  /** Small JPEG for on-screen grids. */
  thumb: Blob;
  fileName: string;
  width: number;
  height: number;
  originalSize: number;
  compressedSize: number;
}

const HEIC_EXT = /\.hei[cf]$/i;

/** Cheap pre-check so we only load the HEIC decoder when it might be needed. */
function mightBeHeic(file: File) {
  return /image\/hei[cf]/i.test(file.type) || HEIC_EXT.test(file.name) || file.type === '';
}

/** HEIC/HEIF to JPEG. heic-to ships a current libheif; heic2any fails on newer iOS photos. */
async function convertHeicToJpeg(file: File): Promise<File> {
  const { isHeic, heicTo } = await import('heic-to');
  if (!(await isHeic(file))) return file;

  const jpeg = await heicTo({ blob: file, type: 'image/jpeg', quality: 0.9 });
  return new File([jpeg], file.name.replace(HEIC_EXT, '.jpg'), { type: 'image/jpeg' });
}

function makeCanvas(width: number, height: number) {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(width, height);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function canvasToJpeg(canvas: OffscreenCanvas | HTMLCanvasElement, quality: number): Promise<Blob> {
  if (canvas instanceof OffscreenCanvas) {
    return canvas.convertToBlob({ type: 'image/jpeg', quality });
  }
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not encode image'))),
      'image/jpeg',
      quality
    )
  );
}

/**
 * Draw onto a white canvas (so transparent PNGs don't turn black) and encode as JPEG.
 * `fit: 'inside'` scales down to maxDimension; `fit: 'square'` letterboxes into a square.
 */
async function drawToJpeg(
  source: Blob,
  maxDimension: number,
  quality: number,
  fit: 'inside' | 'square'
) {
  const bitmap = await createImageBitmap(source, { imageOrientation: 'from-image' });
  try {
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvasW = fit === 'square' ? maxDimension : w;
    const canvasH = fit === 'square' ? maxDimension : h;

    const canvas = makeCanvas(canvasW, canvasH);
    const ctx = canvas.getContext('2d') as
      | OffscreenCanvasRenderingContext2D
      | CanvasRenderingContext2D
      | null;
    if (!ctx) throw new Error('Canvas not supported');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasW, canvasH);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, Math.round((canvasW - w) / 2), Math.round((canvasH - h) / 2), w, h);

    return { blob: await canvasToJpeg(canvas, quality), width: canvasW, height: canvasH };
  } finally {
    bitmap.close();
  }
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error('Could not read image'));
    reader.readAsDataURL(blob);
  });
}

/** Convert (HEIC, PNG, WebP...) and compress one photo to JPEG for the AI. */
export async function prepareImage(file: File, quality: ImageQuality): Promise<PreparedImage> {
  const { maxDimension, jpegQuality } = IMAGE_QUALITY_PRESETS[quality];
  const source = mightBeHeic(file) ? await convertHeicToJpeg(file) : file;
  const { blob, width, height } = await drawToJpeg(source, maxDimension, jpegQuality, 'inside');
  const { blob: thumb } = await drawToJpeg(blob, DISPLAY_THUMB_PX, 0.7, 'inside');

  return {
    blob,
    thumb,
    fileName: `${source.name.replace(/\.[^.]+$/, '')}.jpg`,
    width,
    height,
    originalSize: file.size,
    compressedSize: blob.size,
  };
}

/**
 * Small square JPEG thumbnail for the Excel export.
 * 96px stays sharp in both while staying a few KB each. Never embed full photos.
 */
export async function createThumbnail(image: Blob, size = 96, quality = 0.7): Promise<string> {
  const { blob } = await drawToJpeg(image, size, quality, 'square');
  return blobToDataUrl(blob);
}
