<script setup lang="ts">
import { BePanel } from "@/modules/ui";

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
      <section v-for="feature in features" :key="feature.key" class="central-panel__feature">
        <header class="central-panel__header">
          <h3 class="central-panel__title">{{ feature.label }}</h3>
          <p v-if="feature.description" class="central-panel__description">
            {{ feature.description }}
          </p>
        </header>
        <component :is="feature.panel" v-model="settings[feature.key]" />
      </section>
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
  gap: 16px;
}

.central-panel__feature + .central-panel__feature {
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.central-panel__header {
  margin-bottom: 8px;
}

.central-panel__title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.central-panel__description {
  margin: 4px 0 0;
  color: var(--muted-foreground);
  font-size: 13px;
}
</style>
