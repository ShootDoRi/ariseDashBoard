<template>
  <tr @click.stop="$emit('row-click', member)" style="cursor: pointer" :class="getRankClass(member.Rank)">
    <TableCell v-for="column in columns" :key="column.key" :column="column" :member="member" :highlight="highlight" :calc-alert="calcAlert" />
  </tr>
</template>

<script setup>
import TableCell from "./TableCell.vue";

defineProps({
  member: Object,
  columns: Array,
  highlight: Function,
  calcAlert: Function,
});

defineEmits(["row-click"]);

function getRankClass(rank) {
  const rankNum = Number(rank);
  if (rankNum === 1) return "rank-1";
  if (rankNum === 2) return "rank-2";
  if (rankNum === 3) return "rank-3";
  return "";
}
</script>

<style scoped>
.rank-1 {
  background-color: rgba(255, 183, 77, 0.25);
  border-left: 3px solid #ffb74d;
}
.rank-2 {
  background-color: rgba(187, 134, 252, 0.25);
  border-left: 3px solid #bb86fc;
}
.rank-3 {
  background-color: rgba(100, 255, 218, 0.25);
  border-left: 3px solid #64ffda;
}
</style>
