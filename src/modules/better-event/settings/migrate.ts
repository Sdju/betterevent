import { createFeatureDefaults } from "../features/defaults";

import type { FeatureSettings } from "./types";

export const SETTINGS_STORAGE_KEY = "betterevent:settings";

export const CURRENT_SETTINGS_VERSION = 1;

export function createDefaultSettings(): FeatureSettings {
  return {
    version: CURRENT_SETTINGS_VERSION,
    ...createFeatureDefaults(),
  };
}

export const migrations = [
  {
    version: 1,
    migrate(_oldData: unknown): FeatureSettings {
      return createDefaultSettings();
    },
  },
];

export function migrateSettings(data: unknown): FeatureSettings {
  let version = (data as FeatureSettings | null)?.version ?? 0;

  if (version === CURRENT_SETTINGS_VERSION) {
    return { ...createDefaultSettings(), ...(data as FeatureSettings) };
  }

  let current = data;

  for (const step of migrations) {
    if (version < step.version) {
      current = step.migrate(current);
      version = step.version;
    }
  }

  return current as FeatureSettings;
}
