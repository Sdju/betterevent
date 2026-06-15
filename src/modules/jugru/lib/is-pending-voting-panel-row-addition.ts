import { isColumnOrderApplied } from "./column-order-marks";
import {
  VOTING_PANEL_BODY_ROW_SELECTOR,
  VOTING_PANEL_TABLE_BODY_SELECTOR,
} from "../selectors/voting-panel";

function isUnmarkedBodyRow(node: Node, fingerprint: string): node is HTMLTableRowElement {
  if (!(node instanceof HTMLTableRowElement)) return false;
  if (!node.matches(VOTING_PANEL_BODY_ROW_SELECTOR)) return false;

  return !isColumnOrderApplied(node, fingerprint);
}

function findUnmarkedBodyRows(node: Node, fingerprint: string): HTMLTableRowElement[] {
  if (!(node instanceof Element)) return [];

  const rows: HTMLTableRowElement[] = [];

  if (isUnmarkedBodyRow(node, fingerprint)) rows.push(node);

  for (const row of node.querySelectorAll<HTMLTableRowElement>(VOTING_PANEL_BODY_ROW_SELECTOR)) {
    if (!isColumnOrderApplied(row, fingerprint)) rows.push(row);
  }

  return rows;
}

/** Добавлены ли в tbody новые строки, которые ещё не переставлены. */
export function isPendingVotingPanelRowAddition(
  records: MutationRecord[],
  fingerprint: string,
): boolean {
  for (const record of records) {
    if (record.type !== "childList") continue;

    const target = record.target;
    if (!(target instanceof Element)) continue;
    if (
      !target.matches(VOTING_PANEL_TABLE_BODY_SELECTOR) &&
      !target.closest(VOTING_PANEL_TABLE_BODY_SELECTOR)
    ) {
      continue;
    }

    for (const node of record.addedNodes) {
      if (findUnmarkedBodyRows(node, fingerprint).length > 0) return true;
    }
  }

  return false;
}
