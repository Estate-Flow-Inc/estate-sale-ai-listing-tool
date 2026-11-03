import type { Listing } from '@/providers';
import type { ListingItem } from '@/store/listingStore';

import { getModel } from '@/config/models';
import { formatDimensions } from '@/lib/format';
import { createThumbnail } from './imageCompression';

/**
 * Inventory download: a .zip with inventory.xlsx and photos/<SKU>.jpg.
 *
 * The first Excel columns match Estate Flow's inventory import exactly (headers
 * are matched by name): SKU, Title, Description, Price, Notes. Don't rename them.
 * Photos are named by SKU so they can always be matched to their row.
 * Thumbnail pattern from estate-flow/web utils/inventorySheetExport.ts.
 */

const THUMB_PX = 62;

type DoneItem = ListingItem & { listing: Listing };

interface Column {
  header: string;
  width: number;
  value: (item: DoneItem) => string | number | null;
  money?: boolean;
  wrap?: boolean;
}

/** Everything that doesn't need its own column, as short readable lines. */
function notesFor(l: Listing) {
  const dims = formatDimensions(l.width_in, l.depth_in, l.height_in);
  const makeModel = [l.make, l.model].filter(Boolean).join(' ');
  const styleEra = [l.style, l.era].filter(Boolean).join(', ');
  return [
    `Condition: ${l.condition}. ${l.condition_notes}`,
    dims && `Size: ${dims}${l.dimensions_estimated ? ' (estimated)' : ''}`,
    makeModel && `Make/model: ${makeModel}`,
    styleEra && `Style: ${styleEra}`,
    l.notable_details.length > 0 && `Worth noting: ${l.notable_details.join('; ')}`,
    `AI price from photos (range $${l.resale_value_low} to $${l.resale_value_high}). Review before your sale.`,
  ]
    .filter(Boolean)
    .join('\n');
}

/** "Furniture > Sideboards" to "Furniture, Sideboards": one comma-separated tags column. */
const categoryTags = (category: string) =>
  category
    .split(/\s*[>›/]\s*/)
    .map((t) => t.trim())
    .filter(Boolean)
    .join(', ');

const COLUMNS: Column[] = [
  // Estate Flow import columns. Keep these headers exact.
  { header: 'SKU', width: 16, value: (i) => i.sku },
  { header: 'Title', width: 36, value: (i) => i.listing.title, wrap: true },
  { header: 'Description', width: 50, value: (i) => i.listing.description, wrap: true },
  { header: 'Price', width: 10, value: (i) => i.listing.suggested_price, money: true },
  { header: 'Notes', width: 50, value: (i) => notesFor(i.listing), wrap: true },
  // Extra detail.
  { header: 'Category', width: 26, value: (i) => categoryTags(i.listing.category) },
  { header: 'Condition', width: 12, value: (i) => i.listing.condition },
  { header: 'Brand', width: 16, value: (i) => i.listing.brand },
  { header: 'Color', width: 16, value: (i) => i.listing.color },
  { header: 'Materials', width: 20, value: (i) => i.listing.materials.join(', ') },
  { header: 'AI value low', width: 12, value: (i) => i.listing.resale_value_low, money: true },
  { header: 'AI value high', width: 12, value: (i) => i.listing.resale_value_high, money: true },
  { header: 'Value confidence', width: 14, value: (i) => i.listing.value_confidence },
  { header: 'Value reasoning', width: 40, value: (i) => i.listing.value_reasoning, wrap: true },
  { header: 'Photo file', width: 20, value: (i) => photoName(i.sku, 0) },
  { header: 'AI model', width: 22, value: (i) => (i.modelId ? getModel(i.modelId).label : null) },
];

/** photos/AI-K7Q-0001.jpg, then AI-K7Q-0001-2.jpg for extra photos of the same item. */
function photoName(sku: string, index: number) {
  return index === 0 ? `${sku}.jpg` : `${sku}-${index + 1}.jpg`;
}

async function buildWorkbook(done: DoneItem[]) {
  const ExcelJS = (await import('exceljs')).default;
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Inventory', { views: [{ state: 'frozen', ySplit: 1, xSplit: 1 }] });

  // Column A holds the thumbnail; the importer ignores it (no matching header).
  sheet.addRow(['Photo', ...COLUMNS.map((c) => c.header)]);
  sheet.getRow(1).font = { bold: true };
  sheet.getColumn(1).width = 11;
  COLUMNS.forEach((c, i) => {
    sheet.getColumn(i + 2).width = c.width;
  });

  for (const item of done) {
    sheet.addRow(['', ...COLUMNS.map((c) => c.value(item) ?? '')]);
    const rowIndex = sheet.rowCount;
    const row = sheet.getRow(rowIndex);
    row.height = THUMB_PX * 0.75;
    COLUMNS.forEach((c, i) => {
      const cell = row.getCell(i + 2);
      if (c.money) cell.numFmt = '$#,##0';
      cell.alignment = { vertical: 'top', wrapText: Boolean(c.wrap) };
    });

    try {
      const thumb = await createThumbnail(item.images[0], THUMB_PX * 2);
      const imageId = workbook.addImage({ base64: thumb.split(',')[1], extension: 'jpeg' });
      sheet.addImage(imageId, {
        tl: { col: 0, row: rowIndex - 1 },
        ext: { width: THUMB_PX, height: THUMB_PX },
      });
    } catch {
      // Thumbnail is a nice-to-have; the row still exports.
    }
  }

  return new Uint8Array(await workbook.xlsx.writeBuffer());
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/** Build and download inventory.xlsx plus every photo, named by SKU, as one .zip. */
export async function downloadInventoryZip(items: ListingItem[]) {
  const done = items.filter((i): i is DoneItem => Boolean(i.listing));
  if (done.length === 0) return;

  const [{ zip }, workbook] = await Promise.all([import('fflate'), buildWorkbook(done)]);

  // Photos are already compressed JPEGs, so store them without recompressing (level 0).
  const files: Record<string, Uint8Array | [Uint8Array, { level: 0 }]> = { 'inventory.xlsx': workbook };
  for (const item of done) {
    for (const [index, blob] of item.images.entries()) {
      files[`photos/${photoName(item.sku, index)}`] = [new Uint8Array(await blob.arrayBuffer()), { level: 0 }];
    }
  }

  const zipped = await new Promise<Uint8Array>((resolve, reject) =>
    zip(files, (err, data) => (err ? reject(err) : resolve(data)))
  );
  const date = new Date().toISOString().slice(0, 10);
  download(new Blob([zipped as BlobPart], { type: 'application/zip' }), `estate-sale-inventory-${date}.zip`);
}
