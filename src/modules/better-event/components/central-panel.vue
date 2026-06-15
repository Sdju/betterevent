<script setup lang="ts">
import { BeAccordionItem, BePanel } from "@/modules/ui";

import { useFeatureSettings } from "../composables/use-feature-settings";
import { features } from "../features/registry";

const settings = useFeatureSettings();
</script>

<template>
  <BePanel title="BetterEvent">
    <p v-if="features.length === 0" class="central-panel__empty">
      Фичи пока не добавлены. Новые модули подключаются в <code>features/</code>.
    </p>

    <div v-else class="central-panel__features">
      <BeAccordionItem
        v-for="feature in features"
        :key="feature.key"
        :title="feature.label"
        :description="feature.description"
      >
        <component :is="feature.panel" v-model="settings[feature.key]" />
      </BeAccordionItem>
    </div>
  </BePanel>
</template>

<style scoped>
.central-panel__empty {
  margin: 0;
  color: var(--muted-foreground);
}

.central-panel__empty code {
  font-size: 12px;
}

.central-panel__features {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
