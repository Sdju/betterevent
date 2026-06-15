/** Ячейки заголовка таблицы панели голосования (shadcn `table-head`). */
export const VOTING_PANEL_COLUMN_HEAD_SELECTOR = 'th[data-slot="table-head"]';

/** Тело таблицы с данными заявок. */
export const VOTING_PANEL_TABLE_BODY_SELECTOR = 'tbody[data-slot="table-body"]';

/** Строки с данными (без filler-row). */
export const VOTING_PANEL_BODY_ROW_SELECTOR = 'tr[data-slot="table-row"]';

/** Ячейки данных в теле таблицы. */
export const VOTING_PANEL_TABLE_CELL_SELECTOR = 'td[data-slot="table-cell"]';

/** Подпись колонки внутри ячейки. */
export const VOTING_PANEL_COLUMN_LABEL_SELECTOR = "span.min-w-0.flex-1";

/** Кнопка подсказки в заголовке — её текст не является именем колонки. */
export const VOTING_PANEL_COLUMN_HELP_SELECTOR = 'button[data-slot="hover-card-trigger"]';

/** Маркер: строка/таблица уже переставлена под текущий fingerprint порядка колонок. */
export const VOTING_PANEL_COLUMN_ORDER_APPLIED_ATTR = "data-betterevent-column-order";
