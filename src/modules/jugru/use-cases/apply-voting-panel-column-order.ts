import {
  clearColumnOrderMarks,
  columnOrderFingerprint,
  isColumnOrderApplied,
  markColumnOrderApplied,
} from "../lib/column-order-marks";
import { mergeColumnOrder } from "../lib/merge-column-order";
import {
  findVotingPanelBodyTable,
  findVotingPanelHeaderRow,
  getVotingPanelBodyCells,
  getVotingPanelBodyRows,
  getVotingPanelHeaderCells,
  readVotingPanelColumnName,
} from "../lib/voting-panel-dom";
import { getVotingPanelColumnsNames } from "./get-voting-panel-columns-names";

const LOG = "[BetterEvent:voting-column-order]";

let baselineColumnOrder: string[] | null = null;

export type ApplyVotingPanelColumnOrderOptions = {
  /** Только строки/узлы без маркера текущего порядка (для observer после подгрузки данных). */
  incremental?: boolean;
  /** Проставлять data-betterevent-column-order после перестановки. */
  markApplied?: boolean;
};

function reorderChildren(parent: HTMLElement, children: HTMLElement[], indexOrder: number[]) {
  const reordered = indexOrder
    .map((index) => children[index])
    .filter((child): child is HTMLElement => child != null);

  for (const child of reordered) {
    parent.appendChild(child);
  }
}

function reorderRowCells(
  row: HTMLTableRowElement,
  cells: HTMLElement[],
  indexOrder: number[],
  label: string,
): boolean {
  if (cells.length !== indexOrder.length) {
    console.debug(LOG, "skip row reorder: cell count mismatch", {
      label,
      cells: cells.length,
      indexOrder: indexOrder.length,
    });
    return false;
  }

  reorderChildren(row, cells, indexOrder);
  return true;
}

function reorderColgroup(table: HTMLTableElement, indexOrder: number[], label: string): boolean {
  const colgroup = table.querySelector("colgroup");
  if (!colgroup) {
    console.debug(LOG, "skip colgroup reorder: colgroup not found", { label });
    return false;
  }

  const cols = [...colgroup.children] as HTMLElement[];
  if (cols.length !== indexOrder.length) {
    console.debug(LOG, "skip colgroup reorder: col count mismatch", {
      label,
      cols: cols.length,
      indexOrder: indexOrder.length,
    });
    return false;
  }

  reorderChildren(colgroup, cols, indexOrder);
  return true;
}

function ensureBaseline(root: ParentNode) {
  if (baselineColumnOrder?.length) return;

  baselineColumnOrder = getVotingPanelColumnsNames(root).map((column) => column.name);
}

/** Исходный порядок колонок React (baseline + новые колонки с хоста). */
function getOriginalColumnNames(root: ParentNode): string[] {
  ensureBaseline(root);

  const baseline = baselineColumnOrder ?? [];
  const currentNames = getVotingPanelHeaderCells(root).map(readVotingPanelColumnName);

  return mergeColumnOrder(baseline, currentNames);
}

function buildIndexOrder(order: string[], root: ParentNode): number[] {
  const originalNames = getOriginalColumnNames(root);
  const mergedNames = mergeColumnOrder(order, originalNames.filter(Boolean));

  return mergedNames.map((name) => originalNames.indexOf(name)).filter((index) => index >= 0);
}

/** Восстанавливает исходный порядок колонок на странице. */
export function restoreVotingPanelColumnOrder(root: ParentNode = document) {
  if (!baselineColumnOrder?.length) {
    console.debug(LOG, "skip restore: baseline not captured");
    return;
  }

  clearColumnOrderMarks(root);
  applyVotingPanelColumnOrder(baselineColumnOrder, root, "restore", {
    incremental: false,
    markApplied: false,
  });
  clearColumnOrderMarks(root);
}

/** Fingerprint текущего сохранённого порядка — для фильтрации мутаций observer. */
export function getVotingPanelColumnOrderFingerprint(
  order: string[],
  root: ParentNode = document,
): string | null {
  if (!findVotingPanelHeaderRow(root)) return null;

  ensureBaseline(root);

  const indexOrder = buildIndexOrder(order, root);
  if (!indexOrder.length) return null;

  return columnOrderFingerprint(indexOrder);
}

/** Есть ли на странице таблица голосования с непомеченными строками/узлами. */
export function hasPendingVotingPanelColumnOrderApply(
  order: string[],
  root: ParentNode = document,
): boolean {
  const headerRow = findVotingPanelHeaderRow(root);
  if (!headerRow) return false;

  const fingerprint = getVotingPanelColumnOrderFingerprint(order, root);
  if (!fingerprint) return false;

  const headerTable = headerRow.closest("table");
  const bodyRows = getVotingPanelBodyRows(root);
  const bodyTable = findVotingPanelBodyTable(root);

  if (!isColumnOrderApplied(headerRow, fingerprint)) return true;
  if (headerTable && !isColumnOrderApplied(headerTable, fingerprint)) return true;
  if (bodyTable && !isColumnOrderApplied(bodyTable, fingerprint)) return true;

  return bodyRows.some((row) => !isColumnOrderApplied(row, fingerprint));
}

/**
 * Переставляет колонки панели голосования.
 * JugRu рендерит thead и tbody в разных `<table>`; для `table-fixed` двигаем ещё и `<col>`.
 */
export function applyVotingPanelColumnOrder(
  order: string[],
  root: ParentNode = document,
  reason = "apply",
  options: ApplyVotingPanelColumnOrderOptions = {},
) {
  const { incremental = false, markApplied = true } = options;
  const headerRow = findVotingPanelHeaderRow(root);
  if (!headerRow) {
    console.debug(LOG, "skip apply: header row not found", { reason, order, incremental });
    return;
  }

  ensureBaseline(root);

  const headerCells = getVotingPanelHeaderCells(root);
  if (!headerCells.length) {
    console.debug(LOG, "skip apply: header cells not found", { reason, order, incremental });
    return;
  }

  const currentNames = headerCells.map(readVotingPanelColumnName);
  const originalNames = getOriginalColumnNames(root);
  const indexOrder = buildIndexOrder(order, root);
  const mergedOrder = indexOrder.map((index) => originalNames[index]).filter(Boolean);
  const fingerprint = columnOrderFingerprint(indexOrder);

  const headerTable = headerRow.closest("table");
  const bodyRows = getVotingPanelBodyRows(root);
  const bodyTable = bodyRows[0]?.closest("table") ?? null;

  const pendingBodyRows = bodyRows.filter((row) => !isColumnOrderApplied(row, fingerprint));
  const headerPending = !isColumnOrderApplied(headerRow, fingerprint);
  const headerTablePending = headerTable != null && !isColumnOrderApplied(headerTable, fingerprint);
  const bodyTablePending = bodyTable != null && !isColumnOrderApplied(bodyTable, fingerprint);

  if (
    incremental &&
    !headerPending &&
    !headerTablePending &&
    !bodyTablePending &&
    !pendingBodyRows.length
  ) {
    console.debug(LOG, "skip incremental apply: all rows already marked", { reason, fingerprint });
    return;
  }

  let headerReordered = 0;
  let bodyReordered = 0;

  if (!incremental || headerPending) {
    if (reorderRowCells(headerRow, headerCells, indexOrder, "header")) {
      if (markApplied) markColumnOrderApplied(headerRow, fingerprint);
      headerReordered = 1;
    }
  }

  if (headerTable && (!incremental || headerTablePending)) {
    if (reorderColgroup(headerTable, indexOrder, "header-table") && markApplied) {
      markColumnOrderApplied(headerTable, fingerprint);
    }
  }

  if (bodyTable && (!incremental || bodyTablePending)) {
    if (reorderColgroup(bodyTable, indexOrder, "body-table") && markApplied) {
      markColumnOrderApplied(bodyTable, fingerprint);
    }
  }

  const rowsToProcess = incremental ? pendingBodyRows : bodyRows;

  for (const [rowIndex, bodyRow] of rowsToProcess.entries()) {
    if (
      reorderRowCells(bodyRow, getVotingPanelBodyCells(bodyRow), indexOrder, `body-row-${rowIndex}`)
    ) {
      if (markApplied) markColumnOrderApplied(bodyRow, fingerprint);
      bodyReordered += 1;
    }
  }

  console.debug(LOG, "applied column order", {
    reason,
    incremental,
    requestedOrder: order,
    originalNames,
    currentHeaderNames: currentNames,
    mergedOrder,
    indexOrder,
    fingerprint,
    headerReordered,
    bodyReordered,
    pendingBodyRows: pendingBodyRows.length,
    totalBodyRows: bodyRows.length,
    hasHeaderColgroup: Boolean(headerTable?.querySelector("colgroup")),
    hasBodyColgroup: Boolean(bodyTable?.querySelector("colgroup")),
  });
}
