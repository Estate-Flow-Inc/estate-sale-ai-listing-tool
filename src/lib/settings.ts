import {
  DEFAULT_SETTINGS,
  IMAGE_QUALITY_PRESETS,
  SETTINGS_STORAGE_KEY,
  type ImageQuality,
  type Settings,
} from '@/config/settings';

/**
 * Tiny settings store backed by localStorage. Storage can be blocked
 * (private mode, disabled site data), so every access falls back to defaults.
 */

function isImageQuality(value: unknown): value is ImageQuality {
  return typeof value === 'string' && value in IMAGE_QUALITY_PRESETS;
}

/** Keep only known, valid fields so old or hand-edited storage can't break the app. */
function sanitize(value: unknown): Settings {
  const settings = { ...DEFAULT_SETTINGS };
  if (value && typeof value === 'object') {
    const v = value as Record<string, unknown>;
    if (isImageQuality(v.imageQuality)) settings.imageQuality = v.imageQuality;
  }
  return settings;
}

function read(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return raw ? sanitize(JSON.parse(raw)) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

let current: Settings = read();
const listeners = new Set<() => void>();

export function getSettings(): Settings {
  return current;
}

export function updateSettings(patch: Partial<Settings>) {
  current = sanitize({ ...current, ...patch });
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(current));
  } catch {
    // Storage unavailable: settings still apply for this session.
  }
  listeners.forEach((listener) => listener());
}

export function subscribeSettings(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
