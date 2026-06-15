import { bootstrapJugru } from "@/modules/jugru";
import { mount } from "@/modules/better-event";

export function autostartJugru() {
  if (typeof window === "undefined") return;

  const start = () => bootstrapJugru(mount);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
}
