import { mount, mountWidget } from "@/modules/widget";

export function registerGlobal() {
  if (typeof window === "undefined") return;

  window.BetterEvent = { mount, mountWidget };
}
