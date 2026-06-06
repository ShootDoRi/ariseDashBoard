import { defineStore } from "pinia";
import { ref, computed, watch, reactive } from "vue";
import dayjs from "dayjs";
import sheetData from "@/json/arise/sheet_data.json";
export const useAriseStore = defineStore("arise", () => {
  const tableData = reactive([
    ...sheetData.map((itm) => {
      const { 기타사항: omit1, _originalRowNumber: omit2, ...rest } = itm;
      return rest;
    }),
  ]);

  function parseScore(value) {
    if (value === undefined || value === null || value === "") return Number.NaN;
    return Number(String(value).replace(/,/g, ""));
  }

  const scoreValues = computed(() => {
    return tableData.map((m) => parseScore(m["길드레이드_점수"])).filter((v) => !isNaN(v));
  });

  const averageScore = computed(() => {
    if (scoreValues.value.length === 0) return "0";
    const average = scoreValues.value.reduce((a, b) => a + b, 0) / scoreValues.value.length;
    return Math.round(average).toLocaleString("ko-KR");
  });

  const averageRage = averageScore;

  // 길드레이드 실제 참여자 수
  const actualParticipants = computed(() => {
    return scoreValues.value.length;
  });

  // 점수별 개수 집계
  const rageCountData = computed(() => {
    const count = {};
    tableData.forEach((m) => {
      const score = parseScore(m["길드레이드_점수"]);
      if (!isNaN(score)) {
        count[score] = (count[score] || 0) + 1;
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
    averageScore,
    averageRage,
    rageCountData,
    actualParticipants,
    searchState,
    modalState,
    seasonEndDate,
  };
});
