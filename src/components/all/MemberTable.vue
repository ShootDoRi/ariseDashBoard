<template>
  <div class="table-wrap">
    <table class="member-table">
      <TableHeader
        :columns="columns"
        :sort-key="sortKey"
        :sort-order="sortOrder"
        @sort="sortBy"
      />
      <tbody>
        <TableRow
          v-for="member in filteredData"
          :key="member.rank"
          :member="member"
          :columns="columns"
          :highlight="highlight"
          :calc-alert="calcAlert"
        />
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useMemberTable } from "@/composables/useMemberTable";
import TableHeader from "@/components/common/table/TableHeader.vue";
import TableRow from "@/components/common/table/TableRow.vue";

import allData from "@/json/all/sheet_data.json"; // all 데이터 사용

const {
  columns,
  sortKey,
  sortOrder,
  filteredData,
  sortBy,
  calcAlert,
  highlight,
  openUserModal,
  getRankClass,
} = useMemberTable("all");

const list = ref([...allData]);

const mergedList = computed(() => {
  const map = new Map();
  list.value.forEach((item) => {
    const tag = item["순위"];
    if (!map.has(tag)) {
      map.set(tag, { ...item });
    } else {
      map.set(tag, { ...map.get(tag), ...item });
    }
  });
  return Array.from(map.values());
});
</script>

<style lang="scss">
@include mobile-columns(("col-no", "col-gal", "col-rage", "col-rank"));
</style>
