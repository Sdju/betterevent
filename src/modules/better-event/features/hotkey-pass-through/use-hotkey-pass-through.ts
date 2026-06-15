import { onScopeDispose, watch } from "vue";

import { hotkeyPassThroughDefaults } from "./settings";

import { useFeatureSettings } from "../../composables/use-feature-settings";

function isCtrlOrCmdShortcut(event: KeyboardEvent): boolean {
  if (!event.ctrlKey && !event.metaKey) return false;

  const { key } = event;
  if (!key || key === "Control" || key === "Meta") return false;

  return true;
}

function createHandler() {
  return (event: KeyboardEvent) => {
    if (!isCtrlOrCmdShortcut(event)) return;

    // Без preventDefault — нативные сочетания браузера сохраняются.
    event.stopImmediatePropagation();
    event.stopPropagation();
  };
}

export function useHotkeyPassThrough() {
  const settings = useFeatureSettings();
  let handler: ((event: KeyboardEvent) => void) | null = null;

  const detach = () => {
    if (!handler) return;

    window.removeEventListener("keydown", handler, true);
    handler = null;
  };

  const attach = () => {
    detach();
    handler = createHandler();
    window.addEventListener("keydown", handler, true);
  };

  watch(
    () => settings.value.hotkeyPassThrough?.enabled ?? hotkeyPassThroughDefaults.enabled,
    (enabled) => {
      if (enabled) attach();
      else detach();
    },
    { immediate: true },
  );

  onScopeDispose(detach);
}
