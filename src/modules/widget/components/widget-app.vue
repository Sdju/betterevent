<script setup lang="ts">
// Корневой компонент виджета. Все стили — только scoped.
</script>

<template>
  <div class="betterevent-widget">
    <p class="betterevent-widget__label">BetterEvent</p>
  </div>
</template>

<style scoped>
.betterevent-widget {
  --betterevent-text: #1a1a1a;
  --betterevent-surface: #ffffff;
  --betterevent-border: #e5e7eb;

  box-sizing: border-box;
  font-family:
    system-ui,
    -apple-system,
    "Segoe UI",
    Roboto,
    sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: var(--betterevent-text);
  background: var(--betterevent-surface);
  border: 1px solid var(--betterevent-border);
  border-radius: 8px;
  padding: 12px 16px;
}

.betterevent-widget *,
.betterevent-widget *::before,
.betterevent-widget *::after {
  box-sizing: border-box;
}

.betterevent-widget__label {
  margin: 0;
  font-weight: 600;
}
</style>
