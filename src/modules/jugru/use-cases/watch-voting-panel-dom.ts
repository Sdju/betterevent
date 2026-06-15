import { findVotingPanelBodyTable } from "../lib/voting-panel-dom";
import { isPendingVotingPanelRowAddition } from "../lib/is-pending-voting-panel-row-addition";

const LOG = "[BetterEvent:voting-column-order]";

export type WatchVotingPanelDomOptions = {
  root?: ParentNode;
  /** Задержка перед re-apply после добавления новых строк. */
  reapplyDelayMs?: number;
  /** Fingerprint текущего порядка колонок — реагируем только на непомеченные строки. */
  getFingerprint: () => string | null;
  /** Есть ли непомеченные строки/узлы — для первоначальной загрузки таблицы. */
  hasPendingApply: () => boolean;
};

export type WatchVotingPanelDomHandle = {
  stop: () => void;
  /** Выполняет fn без повторного срабатывания observer (например, при ручной перестановке колонок). */
  runWithoutObserving: (fn: () => void) => void;
};

const DEFAULT_REAPPLY_DELAY_MS = 200;

/**
 * Слушает добавление новых строк в tbody и вызывает callback только для непомеченных `tr`.
 */
export function watchVotingPanelDom(
  onChange: () => void,
  options: WatchVotingPanelDomOptions,
): WatchVotingPanelDomHandle {
  const reapplyDelayMs = options.reapplyDelayMs ?? DEFAULT_REAPPLY_DELAY_MS;
  let paused = false;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let observer: MutationObserver | null = null;
  let observedTbody: Element | null = null;

  const schedule = (cause: string) => {
    if (timeoutId != null) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      timeoutId = undefined;
      if (paused) return;

      console.debug(LOG, "running scheduled apply", { cause, delayMs: reapplyDelayMs });
      onChange();
    }, reapplyDelayMs);
  };

  const bindObserver = () => {
    const tbody =
      findVotingPanelBodyTable(options.root ?? document)?.querySelector("tbody") ??
      (options.root ?? document).querySelector('tbody[data-slot="table-body"]');

    if (!tbody || tbody === observedTbody) return false;

    observer?.disconnect();
    observedTbody = tbody;

    observer = new MutationObserver((records) => {
      if (paused) return;

      const fingerprint = options.getFingerprint();
      if (!fingerprint) return;
      if (!isPendingVotingPanelRowAddition(records, fingerprint)) return;

      console.debug(LOG, "new unmarked body rows detected, scheduling incremental apply", {
        records: records.length,
        delayMs: reapplyDelayMs,
        fingerprint,
      });
      schedule("tbody-row-added");
    });

    observer.observe(tbody, { childList: true });
    console.debug(LOG, "observing tbody for new rows", { fingerprint: options.getFingerprint() });

    if (options.hasPendingApply()) {
      schedule("tbody-ready");
    }

    return true;
  };

  bindObserver();

  const rootObserver = new MutationObserver(() => {
    bindObserver();

    if (options.hasPendingApply()) {
      schedule("panel-dom-changed");
    }
  });
  rootObserver.observe(options.root ?? document.body, { childList: true, subtree: true });

  if (options.hasPendingApply()) {
    schedule("initial");
  }

  return {
    stop() {
      if (timeoutId != null) clearTimeout(timeoutId);
      observer?.disconnect();
      rootObserver.disconnect();
      observedTbody = null;
    },
    runWithoutObserving(fn) {
      paused = true;
      try {
        fn();
      } finally {
        queueMicrotask(() => {
          paused = false;
        });
      }
    },
  };
}
