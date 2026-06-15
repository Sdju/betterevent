interface BetterEventWidgetInstance {
  unmount: () => void;
}

interface BetterEventWidgetOptions {
  /** Дополнительные опции виджета — будут расширены позже */
}

declare global {
  interface Window {
    BetterEvent?: {
      mount: (container: HTMLElement) => () => void;
      mountWidget: (
        target: string | HTMLElement,
        options?: BetterEventWidgetOptions,
      ) => BetterEventWidgetInstance;
    };
  }
}

export {};
