import type { FeatureDefinition } from "../types";

import HotkeyPassThroughPanel from "./panel.vue";
import { hotkeyPassThroughDefaults } from "./settings";

import "./settings";

export const hotkeyPassThroughFeature: FeatureDefinition<"hotkeyPassThrough"> = {
  key: "hotkeyPassThrough",
  label: "Горячие клавиши",
  description:
    "Не даёт сайту перехватывать Ctrl/Cmd+… — reload, копирование и прочее работают в браузере.",
  createDefaults: () => hotkeyPassThroughDefaults,
  panel: HotkeyPassThroughPanel,
};
