<template>
  <div class="table-wrap">
    <table class="member-table">
      <TableHeader :columns="columns" :sort-key="sortKey" :sort-order="sortOrder" @sort="sortBy" />
      <tbody>
        <TableRow
          v-for="member in filteredData"
          :key="member.no"
          :member="member"
          :columns="columns"
          :highlight="highlight"
          :calc-alert="calcAlert"
          @row-click="(member) => openUserModal(member, mergedList)"
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
import dayjs from "dayjs";
import sheetDataFlow1 from "@/json/arise/flow/sheet_data_flow.json";
import sheetDataFlow2 from "@/json/arise/flow/sheet_data_flow2.json";
import sheetDataArise from "@/json/arise/flow/sheet_data _45주차.json";

const { columns, sortKey, sortOrder, filteredData, sortBy, calcAlert, highlight, openUserModal, getRankClass } = useMemberTable("arise");

const list = ref([...sheetDataFlow1, ...sheetDataFlow2, ...sheetDataArise.map((itm) => ({ ...itm, "45주차": itm["격노"] }))]);

const mergedList = computed(() => {
  const map = new Map();
  list.value.forEach((item) => {
    const tag = item["태그"];
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
