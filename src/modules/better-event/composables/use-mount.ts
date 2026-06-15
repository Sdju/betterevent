import { createApp, type App as VueApp } from "vue";

import { setAppRoot } from "@/common/utilities/app-root";

import BetterEventShell from "../components/better-event-shell.vue";
import type { BetterEventInstance, BetterEventOptions } from "../types/mount-types";

const instances = new WeakMap<HTMLElement, VueApp>();

function resolveTarget(target: string | HTMLElement): HTMLElement {
  const element = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;

  if (!element) {
    throw new Error("[BetterEvent] Target element not found");
  }

  return element;
}

export function mountBetterEvent(
  target: string | HTMLElement,
  _options: BetterEventOptions = {},
): BetterEventInstance {
  const element = resolveTarget(target);

  if (element.dataset.mounted === "true" || instances.has(element)) {
    return { unmount: () => {} };
  }

  element.dataset.mounted = "true";
  setAppRoot(element);

  const app = createApp(BetterEventShell);
  app.mount(element);
  instances.set(element, app);

  return {
    unmount: () => {
      app.unmount();
      instances.delete(element);
      delete element.dataset.mounted;
      element.removeAttribute("data-betterevent-app");
      element.replaceChildren();
    },
  };
}

export function mount(container: HTMLElement): () => void {
  return mountBetterEvent(container).unmount;
}
