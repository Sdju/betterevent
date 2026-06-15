import { toRaw } from "vue";
import { useLocalStorage } from "@vueuse/core";

import { createDefaultSettings, migrateSettings, SETTINGS_STORAGE_KEY } from "../settings/migrate";
import type { FeatureSettings } from "../settings/types";

export function useFeatureSettings() {
  const settings = useLocalStorage<FeatureSettings>(SETTINGS_STORAGE_KEY, createDefaultSettings(), {
    mergeDefaults: true,
  });

  settings.value = migrateSettings(toRaw(settings.value));

  return settings;
}
