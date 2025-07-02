<template>
  <td :class="column.class">
    <span v-if="column.key === '기타사항'" v-html="highlight(calcAlert(member))"></span>
    <span v-else v-html="highlight(member[column.key])"></span>
  </td>
</template>

<script setup>
defineProps({
  column: Object,
  member: Object,
  highlight: Function,
  calcAlert: Function,
});
</script>
