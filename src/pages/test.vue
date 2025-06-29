<template>
  <div class=""></div>
</template>
<script setup>
import sheetDataFlow1 from "@/json/arise/sheet_data_flow.json";
import sheetDataFlow2 from "@/json/arise/sheet_data_flow2.json";
import sheetDataArise from "@/json/sheet_data _45주차.json";
import { ref, onMounted } from "vue";

const list = ref([...sheetDataFlow1, ...sheetDataFlow2, ...sheetDataArise]);
const mergedList = ref([]);

onMounted(() => {
  const map = new Map();
  list.value.forEach((item) => {
    const tag = item["태그"];
    if (!map.has(tag)) {
      map.set(tag, { ...item });
    } else {
      // 기존 object와 새 object를 병합 (겹치는 키는 새 값으로 덮어쓰기)
      map.set(tag, { ...map.get(tag), ...item });
    }
  });
  mergedList.value = Array.from(map.values());
  console.log("Merged List:", mergedList.value);
});
</script>

<style scoped lang="scss"></style>
