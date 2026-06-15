import type { FeatureSettingsData } from "./types";

import { features } from "./registry";

export function createFeatureDefaults(): FeatureSettingsData {
  return Object.fromEntries(
    features
      .filter((feature): feature is NonNullable<typeof feature> => feature != null)
      .map((feature) => [feature.key, feature.createDefaults()]),
  ) as FeatureSettingsData;
}
