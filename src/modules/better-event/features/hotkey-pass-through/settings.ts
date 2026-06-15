export interface HotkeyPassThroughSettings {
  enabled: boolean;
}

export const hotkeyPassThroughDefaults: HotkeyPassThroughSettings = {
  enabled: true,
};

declare module "@/modules/better-event/settings/types" {
  interface FeatureSettings {
    hotkeyPassThrough: HotkeyPassThroughSettings;
  }
}
