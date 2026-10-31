/**
 * The listing shape every provider must return.
 * JSON Schema in strict mode: every field required, unknowns are null.
 */

export const CONDITION_GRADES = ['New', 'Like new', 'Good', 'Fair', 'Poor', 'For parts'] as const;
export const SHIPPING_METHODS = ['Small parcel', 'Large parcel', 'Freight', 'Local pickup only'] as const;
export const CONFIDENCE_LEVELS = ['low', 'medium', 'high'] as const;

export type ConditionGrade = (typeof CONDITION_GRADES)[number];
export type ShippingMethod = (typeof SHIPPING_METHODS)[number];
export type Confidence = (typeof CONFIDENCE_LEVELS)[number];

export interface Listing {
  title: string;
  description: string;
  category: string;
  brand: string | null;
  make: string | null;
  model: string | null;
  color: string | null;
  materials: string[];
  style: string | null;
  era: string | null;
  notable_details: string[];
  condition: ConditionGrade;
  condition_notes: string;
  width_in: number | null;
  depth_in: number | null;
  height_in: number | null;
  dimensions_estimated: boolean;
  weight_lb: number | null;
  resale_value_low: number;
  resale_value_high: number;
  value_confidence: Confidence;
  value_reasoning: string;
  shipping_method: ShippingMethod;
  shipping_cost_low: number | null;
  shipping_cost_high: number | null;
  package_notes: string;
  verify_before_selling: string[];
  keywords: string[];
}

const str = { type: 'string' };
const nullableStr = { type: ['string', 'null'] };
const nullableNum = { type: ['number', 'null'] };
const strList = { type: 'array', items: str };

export const LISTING_JSON_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    title: { type: 'string', description: 'Max 80 characters.' },
    description: str,
    category: { type: 'string', description: 'Broad > specific, e.g. "Furniture > Sideboards".' },
    brand: nullableStr,
    make: nullableStr,
    model: nullableStr,
    color: nullableStr,
    materials: strList,
    style: nullableStr,
    era: nullableStr,
    notable_details: strList,
    condition: { type: 'string', enum: CONDITION_GRADES },
    condition_notes: str,
    width_in: nullableNum,
    depth_in: nullableNum,
    height_in: nullableNum,
    dimensions_estimated: { type: 'boolean' },
    weight_lb: nullableNum,
    resale_value_low: { type: 'number' },
    resale_value_high: { type: 'number' },
    value_confidence: { type: 'string', enum: CONFIDENCE_LEVELS },
    value_reasoning: str,
    shipping_method: { type: 'string', enum: SHIPPING_METHODS },
    shipping_cost_low: nullableNum,
    shipping_cost_high: nullableNum,
    package_notes: str,
    verify_before_selling: strList,
    keywords: strList,
  },
  required: [
    'title', 'description', 'category', 'brand', 'make', 'model', 'color', 'materials',
    'style', 'era', 'notable_details', 'condition', 'condition_notes', 'width_in', 'depth_in',
    'height_in', 'dimensions_estimated', 'weight_lb', 'resale_value_low', 'resale_value_high',
    'value_confidence', 'value_reasoning', 'shipping_method', 'shipping_cost_low',
    'shipping_cost_high', 'package_notes', 'verify_before_selling', 'keywords',
  ],
} as const;

/** Parse the model's JSON. Strict mode guarantees the shape; this guards against truncation. */
export function parseListing(text: string): Listing {
  const data = JSON.parse(text) as Listing;
  if (typeof data?.title !== 'string' || typeof data.description !== 'string') {
    throw new Error('Listing is missing required fields');
  }
  return data;
}
