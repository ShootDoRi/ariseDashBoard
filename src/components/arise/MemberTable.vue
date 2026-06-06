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
          :key="member['태그'] || member['순번']"
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
import { computed } from "vue";
import { useMemberTable } from "@/composables/useMemberTable";
import TableHeader from "@/components/common/table/TableHeader.vue";
import TableRow from "@/components/common/table/TableRow.vue";
import flowData from "@/json/arise/flow/sheet_data_flow_final.json";

const {
  columns,
  sortKey,
  sortOrder,
  filteredData,
  sortBy,
  calcAlert,
  highlight,
  openUserModal,
} = useMemberTable("arise");

const mergedList = computed(() => {
  const map = new Map();
  flowData.forEach((item) => {
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
@include mobile-columns(("col-no", "col-tag", "col-raid", "col-rank"));
</style>
