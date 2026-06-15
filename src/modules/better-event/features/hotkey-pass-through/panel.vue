<script setup lang="ts">
import type { HotkeyPassThroughSettings } from "./settings";

const model = defineModel<HotkeyPassThroughSettings>({ required: true });
</script>

<template>
  <label class="hotkey-panel__toggle">
    <input v-model="model.enabled" type="checkbox" class="hotkey-panel__input" />
    <span>Блокировать перехват на сайте</span>
  </label>
</template>

<style scoped>
.hotkey-panel__toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
}

.hotkey-panel__input {
  margin: 0;
}
</style>
