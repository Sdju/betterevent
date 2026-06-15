import {
  findVotingPanelHeaderRow,
  getVotingPanelHeaderCells,
  readVotingPanelColumnName,
} from "../lib/voting-panel-dom";
import type { VotingPanelColumn } from "../types/voting-panel";

/**
 * Возвращает колонки панели голосования в текущем порядке DOM.
 * Ищет первую таблицу с `th[data-slot="table-head"]` внутри `root`.
 */
export function getVotingPanelColumnsNames(root: ParentNode = document): VotingPanelColumn[] {
  if (!findVotingPanelHeaderRow(root)) return [];

  return getVotingPanelHeaderCells(root).flatMap((cell, index) => {
    const name = readVotingPanelColumnName(cell);
    return name ? [{ index, name }] : [];
  });
}
