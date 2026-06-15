import { hotkeyPassThroughFeature } from "./hotkey-pass-through/definition";
import { votingColumnOrderFeature } from "./voting-column-order/definition";
import type { FeatureDefinition } from "./types";

import "./hotkey-pass-through/settings";
import "./voting-column-order/settings";

/** Список фич. Каждая — отдельная директория в `features/`. */
export const features: FeatureDefinition[] = [hotkeyPassThroughFeature, votingColumnOrderFeature];
