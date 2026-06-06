// src/composables/useMemberTable.js
import { ref, computed, watch, onMounted } from "vue";
import { useCommonStore } from "@/store/common";
import { useAriseStore } from "@/store/arise";
import { useGalleryStore } from "@/store/gallery";
import { useNtrStore } from "@/store/ntr";
import { useAllStore } from "@/store/all";
import { useTableColumns } from "@/composables/useTableColumns";
import dayjs from "dayjs";

export function useMemberTable(storeType) {
  const commonStore = useCommonStore();
  const { columns } = useTableColumns(storeType);

  // 스토어 동적 import
  const store =
    storeType === "arise"
      ? useAriseStore()
      : storeType === "gallery"
      ? useGalleryStore()
      : storeType === "all"
      ? useAllStore()
      : useNtrStore();
  const tableRows = computed(() =>
    storeType === "ntr" ? store.thisWeekData : store.tableData
  );

  const sortKey = ref("");
  const sortOrder = ref(1);

  function sortBy(key) {
    if (sortKey.value === key) {
      sortOrder.value = -sortOrder.value;
    } else {
      sortKey.value = key;
      sortOrder.value = 1;
    }
  }

  function parseSortableNumber(value) {
    if (value === undefined || value === null || value === "" || value === "#N/A") {
      return Number.NaN;
    }
    return Number(String(value).replace(/,/g, ""));
  }

  function calcAlert(data) {
    const rage = Number(data["격노"]);
    const total = Number(data["공헌도합"]?.replace(/,/g, "") || 0);

    const today = dayjs();
    const warningStartDate = dayjs(commonStore.endDate).subtract(1, "day");

    if (today.isBefore(warningStartDate)) return "";
    if (rage >= 135) return "";
    if (rage < 135 && total < 2420) return "경고";
    return "";
  }

  const filteredData = computed(() => {
    const keyword = store.searchState.keyword.trim();
    let data = tableRows.value.map((row) => ({
      ...row,
      기타사항: calcAlert(row),
    }));

    if (keyword.length >= 2) {
      data = data.filter((row) =>
        Object.values(row)
          .join(" ")
          .toLowerCase()
          .includes(keyword.toLowerCase())
      );
    }

    if (!sortKey.value) return data;
    return data.sort((a, b) => {
      const aVal = sortKey.value === "기타사항" ? a.기타사항 : a[sortKey.value];
      const bVal = sortKey.value === "기타사항" ? b.기타사항 : b[sortKey.value];

      if (["격노", "길드레이드_점수", "Rank"].includes(sortKey.value)) {
        const aNumber = parseSortableNumber(aVal);
        const bNumber = parseSortableNumber(bVal);
        const aEmpty = Number.isNaN(aNumber);
        const bEmpty = Number.isNaN(bNumber);
        if (aEmpty && !bEmpty) return 1;
        if (!aEmpty && bEmpty) return -1;
        if (aEmpty && bEmpty) return 0;
        return (aNumber - bNumber) * sortOrder.value;
      }

      if (sortKey.value === "기타사항") {
        if (sortOrder.value === 1) {
          return (bVal === "경고" ? 1 : 0) - (aVal === "경고" ? 1 : 0);
        } else {
          return (aVal === "경고" ? 1 : 0) - (bVal === "경고" ? 1 : 0);
        }
      }

      if (!isNaN(Number(aVal)) && !isNaN(Number(bVal))) {
        return (Number(aVal) - Number(bVal)) * sortOrder.value;
      }
      return String(aVal).localeCompare(String(bVal), "ko") * sortOrder.value;
    });
  });

  function highlight(text) {
    const keyword = store.searchState.keyword.trim();
    if (!keyword || keyword.length < 2 || !text) return text ?? "";
    const re = new RegExp(
      `(${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    return String(text).replace(re, '<span class="highlight">$1</span>');
  }

  function openUserModal(member, mergedList) {
    const keyField = storeType === "gallery" ? "인게임_닉" : "태그";
    const mergedData = mergedList.find((m) => m[keyField] === member[keyField]);
    commonStore.modalState.userData = { ...mergedData, ...member };
    commonStore.modalState.isOpen = true;
  }

  function getRankClass(rank) {
    const rankNum = Number(rank);
    if (rankNum === 1) return "rank-1";
    if (rankNum === 2) return "rank-2";
    if (rankNum === 3) return "rank-3";
    return "";
  }

  return {
    columns,
    sortKey,
    sortOrder,
    filteredData,
    sortBy,
    calcAlert,
    highlight,
    openUserModal,
    getRankClass,
    store,
  };
}
