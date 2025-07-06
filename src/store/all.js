import { defineStore } from "pinia";
import sheetData from "@/json/all/sheet_data.json";
import dayjs from "dayjs";
import { ref, computed, watch, reactive } from "vue";

export const useAllStore = defineStore("all", () => {
  const tableData = reactive([
    ...sheetData.map((itm) => {
      const { _originalRowNumber: omit1, ...rest } = itm;
      return rest;
    }),
  ]);

  // 평균 격노 계산 (숫자 변환 및 NaN 방지)
  const averageRage = computed(() => {
    const rageArr = tableData
      .filter((m) => m["격노"] && m["격노"].toString().trim() !== "") // 빈 문자열 제외
      .map((m) => Number(m["격노"]))
      .filter((v) => !isNaN(v));
    if (rageArr.length === 0) return 0;
    return (rageArr.reduce((a, b) => a + b, 0) / rageArr.length).toFixed(2);
  });

  // 길드레이드 실제 참여자 수
  const actualParticipants = computed(() => {
    return tableData.filter(
      (m) => m["격노"] && m["격노"].toString().trim() !== ""
    ).length;
  });

  // 격노별 개수 집계
  const rageCountData = computed(() => {
    const count = {};
    tableData.forEach((m) => {
      const rage = m["격노"];
      if (rage && rage.toString().trim() !== "") {
        // 빈 문자열 제외
        count[rage] = (count[rage] || 0) + 1;
      }
    });
    return count;
  });

  const seasonEndDate = ref(dayjs("2025-07-03"));

  // search
  const searchState = reactive({
    keyword: "",
  });

  // user modal
  const modalState = reactive({
    isOpen: false,
    userData: null,
  });

  return {
    tableData,
    averageRage,
    rageCountData,
    actualParticipants,
    searchState,
    modalState,
    seasonEndDate,
  };
});
