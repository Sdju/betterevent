<script setup lang="ts">
defineProps<{
  ariaExpanded?: boolean;
  ariaLabel?: string;
}>();
</script>

<template>
  <button
    type="button"
    class="be-fab"
    :aria-expanded="ariaExpanded"
    :aria-label="ariaLabel ?? 'BetterEvent'"
  >
    <slot />
  </button>
</template>

<style scoped>
.be-fab {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 9999px;
  background: var(--card);
  color: var(--foreground);
  cursor: pointer;
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
  pointer-events: auto;
  transition:
    transform 0.15s ease,
    opacity 0.15s ease;
}

.be-fab:hover {
  background: var(--accent);
}

.be-fab:active {
  transform: scale(0.96);
}
</style>
