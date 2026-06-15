import { onScopeDispose, watch } from "vue";

import {
  applyVotingPanelColumnOrder,
  getVotingPanelColumnOrderFingerprint,
  hasPendingVotingPanelColumnOrderApply,
  restoreVotingPanelColumnOrder,
  watchVotingPanelDom,
} from "@/modules/jugru";

import { votingColumnOrderDefaults } from "./settings";

import { useFeatureSettings } from "../../composables/use-feature-settings";

export function useVotingColumnOrder() {
  const settings = useFeatureSettings();
  let domWatch: ReturnType<typeof watchVotingPanelDom> | null = null;

  const getOrder = () => settings.value.votingColumnOrder?.order ?? votingColumnOrderDefaults.order;

  const applyOrder = (reason: string, incremental = false) => {
    const order = getOrder();
    if (!order.length) return;

    console.debug("[BetterEvent:voting-column-order]", "apply requested", {
      reason,
      incremental,
      order,
    });

    const run = () => applyVotingPanelColumnOrder(order, document, reason, { incremental });
    if (domWatch) domWatch.runWithoutObserving(run);
    else run();
  };

  const stopDomWatch = () => {
    domWatch?.stop();
    domWatch = null;
  };

  const startDomWatch = () => {
    stopDomWatch();

    domWatch = watchVotingPanelDom(() => applyOrder("dom-mutation", true), {
      getFingerprint: () => getVotingPanelColumnOrderFingerprint(getOrder(), document),
      hasPendingApply: () => hasPendingVotingPanelColumnOrderApply(getOrder(), document),
    });
  };

  watch(
    getOrder,
    (order) => {
      if (!order.length) {
        stopDomWatch();
        return;
      }

      startDomWatch();
      applyOrder("settings", false);
    },
    { immediate: true },
  );

  onScopeDispose(() => {
    stopDomWatch();
    restoreVotingPanelColumnOrder();
  });
}
