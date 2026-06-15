<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>

<template>
  <section class="be-panel">
    <header v-if="title || $slots.header" class="be-panel__header">
      <slot name="header">
        <h2 class="be-panel__title">{{ title }}</h2>
      </slot>
    </header>
    <div class="be-panel__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.be-panel {
  box-sizing: border-box;
  min-width: 280px;
  max-width: 360px;
  font-family:
    system-ui,
    -apple-system,
    "Segoe UI",
    Roboto,
    sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: var(--foreground);
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: 0 12px 32px rgb(0 0 0 / 18%);
}

.be-panel *,
.be-panel *::before,
.be-panel *::after {
  box-sizing: border-box;
}

.be-panel__header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
}

.be-panel__title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}

.be-panel__body {
  padding: 12px 16px;
}
</style>
