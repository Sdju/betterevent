<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
  open?: boolean;
}>();
</script>

<template>
  <details class="be-accordion-item" :open="open">
    <summary class="be-accordion-item__summary">
      <span class="be-accordion-item__title">{{ title }}</span>
      <span class="be-accordion-item__chevron" aria-hidden="true" />
    </summary>

    <div class="be-accordion-item__content">
      <p v-if="description" class="be-accordion-item__description">
        {{ description }}
      </p>
      <div class="be-accordion-item__body">
        <slot />
      </div>
    </div>
  </details>
</template>

<style scoped>
.be-accordion-item {
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) - 2px);
  background: var(--background);
  overflow: hidden;
}

.be-accordion-item__summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  list-style: none;
  user-select: none;
}

.be-accordion-item__summary::-webkit-details-marker {
  display: none;
}

.be-accordion-item__summary::marker {
  content: "";
}

.be-accordion-item__summary:hover {
  background: color-mix(in srgb, var(--muted) 40%, transparent);
}

.be-accordion-item__title {
  min-width: 0;
}

.be-accordion-item__chevron {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-right: 2px solid var(--muted-foreground);
  border-bottom: 2px solid var(--muted-foreground);
  transform: rotate(-45deg);
  transition: transform 0.15s ease;
}

.be-accordion-item[open] .be-accordion-item__chevron {
  transform: rotate(45deg);
}

.be-accordion-item__content {
  padding: 0 12px 12px;
  border-top: 1px solid var(--border);
}

.be-accordion-item__description {
  margin: 10px 0 0;
  color: var(--muted-foreground);
  font-size: 13px;
  font-weight: 400;
  line-height: 1.45;
}

.be-accordion-item__body {
  margin-top: 10px;
}
</style>
