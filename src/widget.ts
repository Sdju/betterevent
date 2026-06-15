import { createApp, type App as VueApp } from "vue";

import { setAppRoot } from "./appRoot";
import { bootstrapJugru } from "./jugru/bootstrap";
import WidgetApp from "./WidgetApp.vue";

export interface WidgetOptions {
  /** Дополнительные опции виджета — будут расширены позже */
}

export interface WidgetInstance {
  unmount: () => void;
}

const instances = new WeakMap<HTMLElement, VueApp>();

function resolveTarget(target: string | HTMLElement): HTMLElement {
  const element = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;

  if (!element) {
    throw new Error("[BetterEvent] Target element not found");
  }

  return element;
}

export function mountWidget(
  target: string | HTMLElement,
  _options: WidgetOptions = {},
): WidgetInstance {
  const element = resolveTarget(target);

  if (element.dataset.mounted === "true" || instances.has(element)) {
    return { unmount: () => {} };
  }

  element.dataset.mounted = "true";
  setAppRoot(element);

  const app = createApp(WidgetApp);
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
  return mountWidget(container).unmount;
}

declare global {
  interface Window {
    BetterEvent?: {
      mount: typeof mount;
      mountWidget: typeof mountWidget;
    };
  }
}

if (typeof window !== "undefined") {
  window.BetterEvent = { mount, mountWidget };

  const start = () => bootstrapJugru(mount);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
}
