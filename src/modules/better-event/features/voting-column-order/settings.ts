export interface VotingColumnOrderSettings {
  order: string[];
}

export const votingColumnOrderDefaults: VotingColumnOrderSettings = {
  order: [],
};

declare module "@/modules/better-event/settings/types" {
  interface FeatureSettings {
    votingColumnOrder: VotingColumnOrderSettings;
  }
}
