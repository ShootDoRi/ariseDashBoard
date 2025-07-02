<template>
  <th :class="column.class" @click="handleSort">
    {{ column.label }}
    <span class="sort-icon" v-if="sortKey === column.key">
      <span :class="{ active: sortOrder === 1 }">▲</span>
      <span :class="{ active: sortOrder === -1 }">▼</span>
    </span>
    <span class="sort-icon" v-else>▲▼</span>
  </th>
</template>

<script setup>
const props = defineProps({
  column: Object,
  sortKey: String,
  sortOrder: Number,
});

const emit = defineEmits(["sort"]);

function handleSort() {
  emit("sort", props.column.key);
}
</script>

<style scoped>
.sort-icon {
  font-size: 0.85em;
  margin-left: 4px;
  color: #bfc2e2;
  letter-spacing: -2px;
  user-select: none;
}
.sort-icon .active {
  color: #4fd1c5;
  font-weight: bold;
}
</style>
