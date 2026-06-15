<script setup lang="ts">
import { useToggle } from "@vueuse/core";

import { BeFab, BeIcon } from "@/modules/ui";

import { useFeatures } from "../features/use-features";
import CentralPanel from "./central-panel.vue";

const [open, toggle] = useToggle(false);

useFeatures();
</script>

<template>
  <div class="be-shell">
    <Transition name="be-shell-panel">
      <div v-if="open" class="be-shell__panel">
        <CentralPanel />
      </div>
    </Transition>

    <BeFab
      :aria-expanded="open"
      :aria-label="open ? 'Закрыть панель BetterEvent' : 'Открыть панель BetterEvent'"
      @click="toggle()"
    >
      <BeIcon />
    </BeFab>
  </div>
</template>

<style scoped>
.be-shell {
  position: fixed;
  right: 28px;
  bottom: 16px;
  z-index: 2147483647;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  pointer-events: none;
}

.be-shell__panel {
  pointer-events: auto;
  transform-origin: bottom right;
  width: 400px;
  flex-shrink: 0;
}

.be-shell-panel-enter-active,
.be-shell-panel-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.be-shell-panel-enter-from,
.be-shell-panel-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.96);
}
</style>
