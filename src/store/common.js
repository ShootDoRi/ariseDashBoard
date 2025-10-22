import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import dayjs from "dayjs";

import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);

export const useCommonStore = defineStore("common", () => {
  const endDate = "2025-10-23T08:30:00";
  const seasonEndDate = ref(dayjs(endDate).format("MM/DD HH:mm"));
  const seasonEndDateText = ref("Season62 종료일");

  // search
  const searchState = reactive({
    keyword: "",
  });

  // user modal
  const modalState = reactive({
    isOpen: false,
    userData: null,
  });

  const columns = reactive([
    { key: "순번", label: "순번", class: "col-no" },
    { key: "인게임_닉", label: "인게임_닉", class: "col-nick" },
    { key: "태그", label: "태그", class: "col-tag" },
    { key: "갤닉", label: "갤닉", class: "col-gal" },
    { key: "직위", label: "직위", class: "col-pos" },
    { key: "배틀클래스", label: "배클", class: "col-bc" },
    { key: "보스공헌도", label: "보스공헌도", class: "col-boss" },
    { key: "미션공헌도", label: "미션공헌도", class: "col-mission" },
    { key: "공헌도합", label: "공헌도합", class: "col-total" },
    { key: "길드레이드_점수", label: "길드레이드_점수", class: "col-raid" },
    { key: "격노", label: "격노", class: "col-rage" },
    { key: "Rank", label: "Rank", class: "col-rank" },
    { key: "기타사항", label: "기타사항", class: "col-etc" },
  ]);

  return {
    endDate,
    seasonEndDate,
    seasonEndDateText,
    searchState,
    modalState,
    columns,
  };
});
