import { defineStore } from "pinia";
import { ref, computed, watch, reactive } from "vue";
import sheetData from "../json/sheet_data.json";
export const useCommonStore = defineStore("common", () => {
  const tableData = reactive([
    ...sheetData.map((itm) => {
      const { 기타사항: omit1, _originalRowNumber: omit2, ...rest } = itm;
      return rest;
    }),
  ]);

  // 평균 격노 계산 (숫자 변환 및 NaN 방지)
  const averageRage = computed(() => {
    const rageArr = tableData.map((m) => Number(m["격노"])).filter((v) => !isNaN(v));
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

  watch(
    () => rageCountData.value,
    () => {
      console.log("격노별 개수 집계가 변경되었습니다:", rageCountData.value);
    },
    { immediate: true, deep: true }
  );

  return {
    tableData,
    averageRage,
    rageCountData,
    actualParticipants,
  };
});
