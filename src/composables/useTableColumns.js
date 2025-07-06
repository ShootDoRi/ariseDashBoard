import { computed } from "vue";

const ALL_COLUMNS = {
  순번: { key: "순번", label: "순번", class: "col-no" },
  인게임_닉: { key: "인게임_닉", label: "닉네임", class: "col-nickname" },
  태그: { key: "태그", label: "태그", class: "col-tag" },
  갤닉: { key: "갤닉", label: "갤닉", class: "col-gal" },
  직위: { key: "직위", label: "직위", class: "col-pos" },
  배틀클래스: { key: "배틀클래스", label: "배클", class: "col-bc" },
  보스공헌도: { key: "보스공헌도", label: "보스공헌도", class: "col-boss" },
  미션공헌도: { key: "미션공헌도", label: "미션공헌도", class: "col-mission" },
  공헌도합: { key: "공헌도합", label: "공헌도합", class: "col-total" },
  길드레이드_점수: {
    key: "길드레이드_점수",
    label: "길드레이드_점수",
    class: "col-raid",
  },
  격노: { key: "격노", label: "격노", class: "col-rage" },
  Rank: { key: "Rank", label: "Rank", class: "col-rank" },
  기타사항: { key: "기타사항", label: "기타사항", class: "col-etc" },

  // all 프리셋용 컬럼들 추가
  순위: { key: "순위", label: "순위", class: "col-rank" },
  길드: { key: "길드", label: "길드", class: "col-guild" },
  닉네임: { key: "닉네임", label: "닉네임", class: "col-nickname" },
  점수: { key: "점수", label: "점수", class: "col-score" },
};

const PRESETS = {
  arise: [
    "순번",
    "인게임_닉",
    "태그",
    //"갤닉",
    "직위",
    "배틀클래스",
    "보스공헌도",
    "미션공헌도",
    "공헌도합",
    "길드레이드_점수",
    "격노",
    "Rank",
    "기타사항",
  ],
  gallery: [
    "순번",
    "인게임_닉",
    "태그",
    "직위",
    "배틀클래스",
    "길드레이드_점수",
    "격노",
    "Rank",
    "기타사항",
  ],
  ntr: [
    "순번",
    "인게임_닉",
    "태그",
    "직위",
    "배틀클래스",
    "길드레이드_점수",
    "격노",
    "Rank",
  ],
  all: ["순위", "길드", "닉네임", "점수", "격노"], // all preset 추가
};

export function useTableColumns(preset) {
  const columns = computed(() => {
    const columnKeys = typeof preset === "string" ? PRESETS[preset] : preset;
    return columnKeys.map((key) => ALL_COLUMNS[key]).filter(Boolean);
  });

  return {
    columns,
    allColumns: ALL_COLUMNS,
    presets: PRESETS,
  };
}
