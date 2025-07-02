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
import { ref, computed } from "vue";
import { useMemberTable } from "@/composables/useMemberTable";
import TableHeader from "@/components/common/table/TableHeader.vue";
import TableRow from "@/components/common/table/TableRow.vue";
import sheetDataFlow1 from "@/json/gallery/flow/gallery_flow.json";
import sheetDataGallery from "@/json/gallery/sheet_data.json";

const { columns, sortKey, sortOrder, filteredData, sortBy, calcAlert, highlight, openUserModal, getRankClass } = useMemberTable("gallery");

const list = ref([...sheetDataFlow1, ...sheetDataGallery]);

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
@include mobile-columns(("col-nick", "col-no", "col-rage", "col-rank"));
</style>
