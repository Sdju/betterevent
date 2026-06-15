export interface WidgetOptions {
  /** Дополнительные опции виджета — будут расширены позже */
}

export interface WidgetInstance {
  unmount: () => void;
}
