<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

import { getVotingPanelColumnsNames, mergeColumnOrder } from "@/modules/jugru";

import type { VotingColumnOrderSettings } from "./settings";

const model = defineModel<VotingColumnOrderSettings>({ required: true });

const order = ref<string[]>([]);
const isEmpty = ref(false);
const dragIndex = ref<number | null>(null);
const dragOverIndex = ref<number | null>(null);

const draggedName = computed(() => {
  if (dragIndex.value === null) return null;
  return order.value[dragIndex.value] ?? null;
});

const displayOrder = computed(() => {
  if (dragIndex.value === null || dragOverIndex.value === null) return order.value;

  const next = [...order.value];
  const [item] = next.splice(dragIndex.value, 1);
  if (!item) return order.value;

  next.splice(dragOverIndex.value, 0, item);
  return next;
});

function syncFromPage() {
  const columns = getVotingPanelColumnsNames().map((column) => column.name);
  isEmpty.value = columns.length === 0;
  order.value = mergeColumnOrder(model.value.order, columns);
}

function onDragStart(name: string, event: DragEvent) {
  dragIndex.value = order.value.indexOf(name);
  dragOverIndex.value = dragIndex.value;
  event.dataTransfer?.setData("text/plain", name);
  if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
}

function onDragOver(index: number) {
  dragOverIndex.value = index;
}

function commitDrag() {
  if (dragIndex.value === null || dragOverIndex.value === null) return;

  const next = [...order.value];
  const [item] = next.splice(dragIndex.value, 1);
  if (!item) return;

  next.splice(dragOverIndex.value, 0, item);
  order.value = next;
}

function onDrop() {
  commitDrag();
  onDragEnd();
}

function onDragEnd() {
  dragIndex.value = null;
  dragOverIndex.value = null;
}

watch(
  order,
  (next) => {
    model.value = { order: next };
  },
  { deep: true },
);

onMounted(syncFromPage);
</script>

<template>
  <div class="column-order-panel">
    <p v-if="isEmpty" class="column-order-panel__hint">
      Таблица голосования не найдена на странице.
    </p>

    <template v-else>
      <p class="column-order-panel__hint">Перетащите колонки, чтобы задать порядок.</p>

      <div class="column-order-panel__list">
        <div
          v-for="(name, index) in displayOrder"
          :key="name"
          class="column-order-panel__item"
          :class="{ 'column-order-panel__item--dragging': name === draggedName }"
          draggable="true"
          @dragend="onDragEnd"
          @dragstart="onDragStart(name, $event)"
          @dragover.prevent="onDragOver(index)"
          @drop.prevent="onDrop"
        >
          <span class="column-order-panel__handle" aria-hidden="true">⋮⋮</span>
          <span class="column-order-panel__name">{{ name }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.column-order-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.column-order-panel__hint {
  margin: 0;
  color: var(--muted-foreground);
  font-size: 13px;
}

.column-order-panel__list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.column-order-panel__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) - 2px);
  background: var(--background);
  cursor: grab;
  user-select: none;
}

.column-order-panel__item--dragging {
  opacity: 0.45;
  border-style: dashed;
}

.column-order-panel__item:active {
  cursor: grabbing;
}

.column-order-panel__handle {
  color: var(--muted-foreground);
  font-size: 12px;
  letter-spacing: -2px;
}

.column-order-panel__name {
  font-size: 13px;
}
</style>
