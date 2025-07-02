<template>
  <thead>
    <tr>
      <TableHeaderCell
        v-for="column in columns"
        :key="column.key"
        :column="column"
        :sort-key="sortKey"
        :sort-order="sortOrder"
        @sort="$emit('sort', $event)"
      />
    </tr>
  </thead>
</template>

<script setup>
import TableHeaderCell from "./TableHeaderCell.vue";

defineProps({
  columns: Array,
  sortKey: String,
  sortOrder: Number,
});

defineEmits(["sort"]);
</script>
