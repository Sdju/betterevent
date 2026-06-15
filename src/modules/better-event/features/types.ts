import type { Component } from "vue";

import type { FeatureSettings } from "../settings/types";

export type FeatureSettingsData = Omit<FeatureSettings, "version">;

export type FeatureKey = keyof FeatureSettingsData;

export interface FeatureDefinition<K extends FeatureKey = FeatureKey> {
  key: K;
  label: string;
  description?: string;
  createDefaults: () => FeatureSettings[K];
  panel: Component;
}
