import type { Listing } from '@/providers';
import type { ListingItem } from '@/store/listingStore';

import { formatDimensions } from '@/lib/format';
import { createThumbnail } from './imageCompression';

/**
 * Excel inventory with photo thumbnails.
 *
 * The first columns match Estate Flow's inventory import exactly (headers are
 * matched by name): SKU, Title, Description, Price, Notes. Don't rename them.
 * Everything else rides along in extra columns the importer ignores.
 * Thumbnail pattern from estate-flow/web utils/inventorySheetExport.ts.
 */

const THUMB_PX = 62;

interface Column {
  header: string;
  width: number;
  value: (l: Listing) => string | number | boolean | null;
  money?: boolean;
  wrap?: boolean;
}

const joinList = (list: string[]) => list.join('; ');

/** Whole-dollar midpoint of the AI range. The importer requires a price. */
const suggestedPrice = (l: Listing) => Math.round((l.resale_value_low + l.resale_value_high) / 2);

function notesFor(l: Listing) {
  const dims = formatDimensions(l.width_in, l.depth_in, l.height_in);
  return [
    `Condition: ${l.condition}. ${l.condition_notes}`,
    dims && `Size: ${dims}${l.dimensions_estimated ? ' (estimated)' : ''}`,
    `AI estimate $${l.resale_value_low} to $${l.resale_value_high} from photos, not sold data.`,
  ]
    .filter(Boolean)
    .join('\n');
}

const COLUMNS: Column[] = [
  // Estate Flow import columns. Keep these headers exact.
  { header: 'SKU', width: 12, value: () => '' },
  { header: 'Title', width: 36, value: (l) => l.title, wrap: true },
  { header: 'Description', width: 50, value: (l) => l.description, wrap: true },
  { header: 'Price', width: 10, value: suggestedPrice, money: true },
  { header: 'Notes', width: 40, value: notesFor, wrap: true },
  // Extra detail.
  { header: 'Category', width: 24, value: (l) => l.category },
  { header: 'Condition', width: 12, value: (l) => l.condition },
  { header: 'Condition details', width: 36, value: (l) => l.condition_notes, wrap: true },
  { header: 'Brand', width: 16, value: (l) => l.brand },
  { header: 'Make', width: 16, value: (l) => l.make },
  { header: 'Model', width: 18, value: (l) => l.model },
  { header: 'Color', width: 16, value: (l) => l.color },
  { header: 'Materials', width: 20, value: (l) => joinList(l.materials) },
  { header: 'Style', width: 18, value: (l) => l.style },
  { header: 'Era', width: 10, value: (l) => l.era },
  { header: 'Width (in)', width: 10, value: (l) => l.width_in },
  { header: 'Depth (in)', width: 10, value: (l) => l.depth_in },
  { header: 'Height (in)', width: 10, value: (l) => l.height_in },
  { header: 'Size estimated', width: 12, value: (l) => (l.dimensions_estimated ? 'Yes' : 'No') },
  { header: 'Weight (lb)', width: 11, value: (l) => l.weight_lb },
  { header: 'AI value low', width: 12, value: (l) => l.resale_value_low, money: true },
  { header: 'AI value high', width: 12, value: (l) => l.resale_value_high, money: true },
  { header: 'Value confidence', width: 14, value: (l) => l.value_confidence },
  { header: 'Value reasoning', width: 40, value: (l) => l.value_reasoning, wrap: true },
  { header: 'Shipping method', width: 18, value: (l) => l.shipping_method },
  { header: 'Shipping low', width: 12, value: (l) => l.shipping_cost_low, money: true },
  { header: 'Shipping high', width: 12, value: (l) => l.shipping_cost_high, money: true },
  { header: 'Packing', width: 36, value: (l) => l.package_notes, wrap: true },
  { header: 'Worth noting', width: 36, value: (l) => joinList(l.notable_details), wrap: true },
  { header: 'Check before selling', width: 40, value: (l) => joinList(l.verify_before_selling), wrap: true },
  { header: 'Keywords', width: 36, value: (l) => l.keywords.join(', '), wrap: true },
];

function download(buffer: BlobPart, filename: string) {
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/** Build and download the inventory workbook for every finished listing. */
export async function downloadInventoryExcel(items: ListingItem[]) {
  const done = items.filter((i): i is ListingItem & { listing: Listing } => Boolean(i.listing));
  if (done.length === 0) return;

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
    sheet.addRow(['', ...COLUMNS.map((c) => c.value(item.listing) ?? '')]);
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

  const buffer = await workbook.xlsx.writeBuffer();
  download(buffer, `estate-sale-inventory-${new Date().toISOString().slice(0, 10)}.xlsx`);
}
