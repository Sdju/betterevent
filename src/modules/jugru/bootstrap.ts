const DOCK = "data-betterevent-dock";

export function bootstrapJugru(mount: (container: HTMLElement) => void) {
  if (document.querySelector(`[${DOCK}]`)) return;

  const dock = document.createElement("div");
  dock.setAttribute(DOCK, "");
  dock.style.cssText =
    "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:2147483647;";
  document.body.append(dock);
  mount(dock);
}
