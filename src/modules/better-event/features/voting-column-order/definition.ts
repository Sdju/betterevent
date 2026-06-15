import type { FeatureDefinition } from "../types";

import VotingColumnOrderPanel from "./panel.vue";
import { votingColumnOrderDefaults } from "./settings";

import "./settings";

export const votingColumnOrderFeature: FeatureDefinition<"votingColumnOrder"> = {
  key: "votingColumnOrder",
  label: "Порядок колонок",
  description: "Сортировка колонок таблицы голосования на JugRu.",
  createDefaults: () => votingColumnOrderDefaults,
  panel: VotingColumnOrderPanel,
};
