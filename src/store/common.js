import { defineStore } from "pinia";
import { ref, computed, watch, reactive } from "vue";
import dayjs from "dayjs";

export const useCommonStore = defineStore("common", () => {
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
    seasonEndDate,
    searchState,
    modalState,
  };
});
