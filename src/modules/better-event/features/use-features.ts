import { useHotkeyPassThrough } from "./hotkey-pass-through";
import { useVotingColumnOrder } from "./voting-column-order/use-voting-column-order";

export function useFeatures() {
  useHotkeyPassThrough();
  useVotingColumnOrder();
}
