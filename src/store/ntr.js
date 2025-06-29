import { defineStore } from "pinia";
import { ref, computed, watch, reactive } from "vue";
import dayjs from "dayjs";
import sheetData from "@/json/ntr/ntr_merged.json";

export const useNtrStore = defineStore("ntr", () => {
  const tableData = reactive([...sheetData]);

  // 평균 격노 계산 (숫자 변환 및 NaN 방지)
  const averageRage_ = computed(() => {
    const rageArr = tableData
      .map((m) => Number(m["격노"]))
      .filter((v) => !isNaN(v));
    if (rageArr.length === 0) return 0;
    return (rageArr.reduce((a, b) => a + b, 0) / rageArr.length).toFixed(2);
  });

  const averageRage = computed(() => {
    // 격노 값이 실제로 존재하는 데이터만 평균에 포함
    const rageArr = tableData
      .filter(
        (m) => m["격노"] !== undefined && m["격노"] !== null && m["격노"] !== ""
      )
      .map((m) => Number(m["격노"]))
      .filter((v) => !isNaN(v));
    if (rageArr.length === 0) return 0;
    return (rageArr.reduce((a, b) => a + b, 0) / rageArr.length).toFixed(2);
  });

  // 길드레이드 실제 참여자 수
  const actualParticipants = computed(() => {
    return tableData.filter((m) => !!m["격노"] == true).length;
  });

  // 격노별 개수 집계
  const rageCountData = computed(() => {
    const count = {};
    tableData.forEach((m) => {
      const rage = m["격노"];
      if (rage !== undefined && rage !== null && rage !== "") {
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
    averageRage_,
    averageRage,
    actualParticipants,
    rageCountData,
    seasonEndDate,
    searchState,
    modalState,
  };
});
