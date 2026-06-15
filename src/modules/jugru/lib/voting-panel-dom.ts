import {
  VOTING_PANEL_BODY_ROW_SELECTOR,
  VOTING_PANEL_COLUMN_HEAD_SELECTOR,
  VOTING_PANEL_COLUMN_HELP_SELECTOR,
  VOTING_PANEL_COLUMN_LABEL_SELECTOR,
  VOTING_PANEL_TABLE_BODY_SELECTOR,
  VOTING_PANEL_TABLE_CELL_SELECTOR,
} from "../selectors/voting-panel";

export function readVotingPanelColumnName(cell: HTMLTableCellElement): string {
  for (const label of cell.querySelectorAll(VOTING_PANEL_COLUMN_LABEL_SELECTOR)) {
    if (label.closest(VOTING_PANEL_COLUMN_HELP_SELECTOR)) continue;

    const name = label.textContent?.trim();
    if (name) return name;
  }

  return "";
}

export function findVotingPanelHeaderRow(root: ParentNode): HTMLTableRowElement | null {
  const firstHead = root.querySelector(VOTING_PANEL_COLUMN_HEAD_SELECTOR);
  return firstHead?.closest("tr") ?? null;
}

export function findVotingPanelBodyTable(root: ParentNode = document): HTMLTableElement | null {
  return root.querySelector(VOTING_PANEL_TABLE_BODY_SELECTOR)?.closest("table") ?? null;
}

export function getVotingPanelHeaderCells(root: ParentNode = document): HTMLTableCellElement[] {
  const row = findVotingPanelHeaderRow(root);
  if (!row) return [];

  return [...row.querySelectorAll<HTMLTableCellElement>(VOTING_PANEL_COLUMN_HEAD_SELECTOR)];
}

export function getVotingPanelBodyRows(root: ParentNode = document): HTMLTableRowElement[] {
  const bodyTable = findVotingPanelBodyTable(root);
  if (!bodyTable) return [];

  return [...bodyTable.querySelectorAll<HTMLTableRowElement>(VOTING_PANEL_BODY_ROW_SELECTOR)];
}

export function getVotingPanelBodyCells(row: HTMLTableRowElement): HTMLTableCellElement[] {
  return [...row.children].filter(
    (cell): cell is HTMLTableCellElement =>
      cell instanceof HTMLTableCellElement && cell.matches(VOTING_PANEL_TABLE_CELL_SELECTOR),
  );
}
