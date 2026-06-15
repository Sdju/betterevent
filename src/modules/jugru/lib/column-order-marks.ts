import { VOTING_PANEL_COLUMN_ORDER_APPLIED_ATTR } from "../selectors/voting-panel";

export function columnOrderFingerprint(indexOrder: number[]): string {
  return indexOrder.join(",");
}

export function isColumnOrderApplied(element: Element, fingerprint: string): boolean {
  return element.getAttribute(VOTING_PANEL_COLUMN_ORDER_APPLIED_ATTR) === fingerprint;
}

export function markColumnOrderApplied(element: Element, fingerprint: string) {
  element.setAttribute(VOTING_PANEL_COLUMN_ORDER_APPLIED_ATTR, fingerprint);
}

export function clearColumnOrderMarks(root: ParentNode = document) {
  for (const element of root.querySelectorAll(`[${VOTING_PANEL_COLUMN_ORDER_APPLIED_ATTR}]`)) {
    element.removeAttribute(VOTING_PANEL_COLUMN_ORDER_APPLIED_ATTR);
  }
}
