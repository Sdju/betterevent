import type { FeatureSettingsData } from "./types";

import { features } from "./registry";

export function createFeatureDefaults(): FeatureSettingsData {
  return Object.fromEntries(
    features.map((feature) => [feature.key, feature.createDefaults()]),
  ) as FeatureSettingsData;
}
