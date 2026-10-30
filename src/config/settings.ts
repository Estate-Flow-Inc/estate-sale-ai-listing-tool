/** User settings. Saved to localStorage; labels live in constants/copy.ts (SETTINGS). */

import { DEFAULT_MODEL_ID } from './models';

export type ImageQuality = 'small' | 'balanced' | 'detailed';

/**
 * Photos are resized before sending to the AI. Bigger images cost more tokens
 * and rarely help, except for small text, labels and maker's marks.
 */
export const IMAGE_QUALITY_PRESETS: Record<ImageQuality, { maxDimension: number; jpegQuality: number }> = {
  small: { maxDimension: 768, jpegQuality: 0.75 },
  balanced: { maxDimension: 1024, jpegQuality: 0.8 },
  detailed: { maxDimension: 1536, jpegQuality: 0.85 },
};

export interface Settings {
  imageQuality: ImageQuality;
  modelId: string;
}

export const DEFAULT_SETTINGS: Settings = {
  imageQuality: 'balanced',
  modelId: DEFAULT_MODEL_ID,
};

/** Bump the version if the Settings shape changes in a breaking way. */
export const SETTINGS_STORAGE_KEY = 'ai-estate-sale-listing:settings:v1';
