const TARGET = '[aria-label="Оценка"]';
const DOCK = "data-betterevent-dock";

export function bootstrapJugru(mount: (container: HTMLElement) => void) {
  for (const target of document.querySelectorAll(TARGET)) {
    if (!(target instanceof Element)) continue;
    if (target.previousElementSibling?.hasAttribute(DOCK)) continue;

    const dock = document.createElement("div");
    dock.setAttribute(DOCK, "");
    dock.style.cssText = "width:100%;margin:0 0 16px;";
    target.insertAdjacentElement("beforebegin", dock);
    mount(dock);
  }
}
