const DOCK = "data-betterevent-dock";

export function bootstrapJugru(mount: (container: HTMLElement) => void) {
  if (document.querySelector(`[${DOCK}]`)) return;

  const dock = document.createElement("div");
  dock.setAttribute(DOCK, "");
  dock.style.cssText = "position:fixed;inset:0;z-index:2147483646;pointer-events:none;";
  document.body.append(dock);
  mount(dock);
}
