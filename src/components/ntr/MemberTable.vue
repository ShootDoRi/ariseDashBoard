<template>
  <div class="table-wrap">
    <table class="member-table">
      <thead>
        <tr>
          <th class="col-no" @click="sortBy('순번')">
            순번
            <span class="sort-icon" v-if="sortKey === '순번'">
              <span :class="{ active: sortOrder === 1 }">▲</span>
              <span :class="{ active: sortOrder === -1 }">▼</span>
            </span>
            <span class="sort-icon" v-else>▲▼</span>
          </th>
          <th class="col-nick" @click="sortBy('인게임_닉')">
            인게임_닉
            <span class="sort-icon" v-if="sortKey === '인게임_닉'">
              <span :class="{ active: sortOrder === 1 }">▲</span>
              <span :class="{ active: sortOrder === -1 }">▼</span>
            </span>
            <span class="sort-icon" v-else>▲▼</span>
          </th>
          <th class="col-tag" @click="sortBy('태그')">
            태그
            <span class="sort-icon" v-if="sortKey === '태그'">
              <span :class="{ active: sortOrder === 1 }">▲</span>
              <span :class="{ active: sortOrder === -1 }">▼</span>
            </span>
            <span class="sort-icon" v-else>▲▼</span>
          </th>
          <!-- <th class="col-gal" @click="sortBy('갤닉')">
            갤닉
            <span class="sort-icon" v-if="sortKey === '갤닉'">
              <span :class="{ active: sortOrder === 1 }">▲</span>
              <span :class="{ active: sortOrder === -1 }">▼</span>
            </span>
            <span class="sort-icon" v-else>▲▼</span>
          </th> -->
          <th class="col-pos" @click="sortBy('직위')">
            직위
            <span class="sort-icon" v-if="sortKey === '직위'">
              <span :class="{ active: sortOrder === 1 }">▲</span>
              <span :class="{ active: sortOrder === -1 }">▼</span>
            </span>
            <span class="sort-icon" v-else>▲▼</span>
          </th>
          <th class="col-bc" @click="sortBy('배틀클래스')">
            배클
            <span class="sort-icon" v-if="sortKey === '배틀클래스'">
              <span :class="{ active: sortOrder === 1 }">▲</span>
              <span :class="{ active: sortOrder === -1 }">▼</span>
            </span>
            <span class="sort-icon" v-else>▲▼</span>
          </th>
          <!-- <th class="col-boss" @click="sortBy('보스공헌도')">
            보스공헌도
            <span class="sort-icon" v-if="sortKey === '보스공헌도'">
              <span :class="{ active: sortOrder === 1 }">▲</span>
              <span :class="{ active: sortOrder === -1 }">▼</span>
            </span>
            <span class="sort-icon" v-else>▲▼</span>
          </th>
          <th class="col-mission" @click="sortBy('미션공헌도')">
            미션공헌도
            <span class="sort-icon" v-if="sortKey === '미션공헌도'">
              <span :class="{ active: sortOrder === 1 }">▲</span>
              <span :class="{ active: sortOrder === -1 }">▼</span>
            </span>
            <span class="sort-icon" v-else>▲▼</span>
          </th>
          <th class="col-total" @click="sortBy('공헌도합')">
            공헌도합
            <span class="sort-icon" v-if="sortKey === '공헌도합'">
              <span :class="{ active: sortOrder === 1 }">▲</span>
              <span :class="{ active: sortOrder === -1 }">▼</span>
            </span>
            <span class="sort-icon" v-else>▲▼</span>
          </th> -->
          <th class="col-raid" @click="sortBy('길드레이드_점수')">
            길드레이드_점수
            <span class="sort-icon" v-if="sortKey === '길드레이드_점수'">
              <span :class="{ active: sortOrder === 1 }">▲</span>
              <span :class="{ active: sortOrder === -1 }">▼</span>
            </span>
            <span class="sort-icon" v-else>▲▼</span>
          </th>
          <th class="col-rage" @click="sortBy('격노')">
            격노
            <span class="sort-icon" v-if="sortKey === '격노'">
              <span :class="{ active: sortOrder === 1 }">▲</span>
              <span :class="{ active: sortOrder === -1 }">▼</span>
            </span>
            <span class="sort-icon" v-else>▲▼</span>
          </th>
          <th class="col-rank" @click="sortBy('Rank')">
            Rank
            <span class="sort-icon" v-if="sortKey === 'Rank'">
              <span :class="{ active: sortOrder === 1 }">▲</span>
              <span :class="{ active: sortOrder === -1 }">▼</span>
            </span>
            <span class="sort-icon" v-else>▲▼</span>
          </th>
          <!-- <th class="col-etc" @click="sortBy('기타사항')">
            기타사항
            <span class="sort-icon" v-if="sortKey === '기타사항'">
              <span :class="{ active: sortOrder === 1 }">▲</span>
              <span :class="{ active: sortOrder === -1 }">▼</span>
            </span>
            <span class="sort-icon" v-else>▲▼</span>
          </th> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="m in filteredData" :key="m.no" @click.stop="openUserModal(m)" style="cursor: pointer" :class="getRankClass(m.Rank)">
          <td class="col-no" v-html="highlight(m['순번'])"></td>
          <td class="col-nick" v-html="highlight(m['인게임_닉'])"></td>
          <td class="col-tag" v-html="highlight(m['태그'])"></td>
          <!-- <td class="col-gal" v-html="highlight(m['갤닉'])"></td> -->
          <td class="col-pos" v-html="highlight(m['직위'])"></td>
          <td class="col-bc" v-html="highlight(m['배틀클래스'])"></td>
          <!-- <td class="col-boss" v-html="highlight(m['보스공헌도'])"></td>
          <td class="col-mission" v-html="highlight(m['미션공헌도'])"></td>
          <td class="col-total" v-html="highlight(m['공헌도합'])"></td> -->
          <td class="col-raid" v-html="highlight(m['길드레이드_점수'])"></td>
          <td class="col-rage" v-html="highlight(m['격노'])"></td>
          <td class="col-rank" v-html="highlight(m['Rank'])"></td>
          <!-- <td class="col-etc" v-html="highlight(calcAlert(m))"></td> -->
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useNtrStore } from "@/store/ntr";
import { useCommonStore } from "@/store/common";
import dayjs from "dayjs";
import mergedData from "@/json/ntr/ntr_merged.json";
import sheetData from "@/json/ntr/sheet_data.json";

const ntrStore = useNtrStore();
const commonStore = useCommonStore();

const list = ref([...mergedData]);

const mergedList = computed(() => {
  const map = new Map();
  list.value.forEach((item) => {
    const tag = item["태그"];
    if (!map.has(tag)) {
      map.set(tag, { ...item });
    } else {
      // 기존 object와 새 object를 병합 (겹치는 키는 새 값으로 덮어쓰기)
      map.set(tag, { ...map.get(tag), ...item });
    }
  });
  return Array.from(map.values());
});

const sortKey = ref("");
const sortOrder = ref(1); // 1: 오름차순, -1: 내림차순

function sortBy(key) {
  if (sortKey.value === key) {
    sortOrder.value = -sortOrder.value; // 같은 키 클릭 시 정렬 방향 반전
  } else {
    sortKey.value = key;
    sortOrder.value = 1;
  }
}

/* function calcAlert(data) {
  const rage = Number(data["격노"]);
  const total = Number(data["공헌도합"].replace(/,/g, ""));

  // 시즌 종료 1일 전 날짜 계산
  const today = dayjs();
  const warningStartDate = dayjs(ntrStore.seasonEndDate).subtract(1, "day");

  // 오늘이 경고 시작일 이전이면 경고 표시하지 않음
  if (today.isBefore(warningStartDate)) {
    return "";
  }

  // 경고 시작일 이후면 원래 로직대로 경고 표시
  if (rage >= 135) return "";
  if (rage < 135 && total < 2420) return "경고";
  return "";
} */

const filteredData = computed(() => {
  const keyword = ntrStore.searchState.keyword.trim();
  // 1. "기타사항" 필드를 미리 추가
  /* let data = ntrStore.flowData.map((row) => ({
    ...row,
    //기타사항: calcAlert(row),
  })); */
  let data = ntrStore.thisWeekData.map((row) => ({
    ...row,
    //기타사항: calcAlert(row),
  }));

  // 2. 2글자 이상일 때만 검색 (기타사항도 포함)
  if (keyword.length >= 2) {
    data = data.filter((row) => Object.values(row).join(" ").toLowerCase().includes(keyword.toLowerCase()));
  }

  // 3. 정렬
  if (!sortKey.value) return data;
  return data.sort((a, b) => {
    const aVal = sortKey.value === "기타사항" ? a.기타사항 : a[sortKey.value];
    const bVal = sortKey.value === "기타사항" ? b.기타사항 : b[sortKey.value];

    if (["격노", "Rank"].includes(sortKey.value)) {
      const isEmpty = (v) => v === undefined || v === null || v === "" || v === "#N/A";
      const aEmpty = isEmpty(aVal);
      const bEmpty = isEmpty(bVal);
      if (aEmpty && !bEmpty) return 1;
      if (!aEmpty && bEmpty) return -1;
      if (aEmpty && bEmpty) return 0;
      return (Number(aVal) - Number(bVal)) * sortOrder.value;
    }
    // 기타사항(경고) 정렬: 오름차순(▲)이면 '경고'가 위로, 내림차순(▼)이면 '경고' 없는 사람이 위로
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

const sortedData_ = computed(() => {
  const data = [...ntrStore.flowData];
  if (!sortKey.value) return data;
  return data.sort((a, b) => {
    const aVal = a[sortKey.value];
    const bVal = b[sortKey.value];
    // 숫자 비교 우선, 아니면 문자열 비교
    if (!isNaN(Number(aVal)) && !isNaN(Number(bVal))) {
      return (Number(aVal) - Number(bVal)) * sortOrder.value;
    }
    return String(aVal).localeCompare(String(bVal), "ko") * sortOrder.value;
  });
});

// 하이라이트 함수
function highlight(text) {
  const keyword = ntrStore.searchState.keyword.trim();
  if (!keyword || keyword.length < 2 || !text) return text ?? "";
  const re = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return String(text).replace(re, '<span class="highlight">$1</span>');
}

watch(
  () => ntrStore.flowData,
  (newData) => {
    console.log("Table data updated:", newData);
  },
  { immediate: true, deep: true }
);

const members = ref([]);

function openUserModal(member) {
  console.log("Opening user modal for:", member);
  console.log("mergedList:", mergedList.value);

  console.log(
    "태그된 멤버 : ",
    mergedList.value.find((m) => m["태그"] === member["태그"])
  );

  const mergedData = mergedList.value.find((m) => m["태그"] === member["태그"]);
  //return;
  commonStore.modalState.userData = { ...mergedData, ...member };
  commonStore.modalState.isOpen = true;
  console.log("Opening user modal for:", member);
}

function getRankClass(rank) {
  const rankNum = Number(rank);
  if (rankNum === 1) return "rank-1";
  if (rankNum === 2) return "rank-2";
  if (rankNum === 3) return "rank-3";
  return "";
}

onMounted(() => {
  /* members.value = mergedData.map((itm) => {
    // "기타사항"과 "_originalRowNumber" 키를 제외한 새 객체 생성
    const { 기타사항: omit1, _originalRowNumber: omit2, ...rest } = itm;
    return rest;
  });
  console.log("Members loaded:", members.value); */
});

/* const members = [
  { no: 1, nick: "Lily", tag: "19VGYAQ", position: "CM", level: 70, boss: 790, total: "2.660", score: "42.111", kills: 17, note: "Check" },
  { no: 2, nick: "Raiju", tag: "JTPV3DQ", position: "Vice CM", level: 70, boss: 835, total: "2.705", score: "56.926", kills: 1, note: "Check" },
  { no: 3, nick: "Raiju", tag: "JTPV3DQ", position: "CM", level: 70, boss: 835, total: "2.705", score: "56.926.9", kills: 17, note: "Check" },
  { no: 4, nick: "Ghech", tag: "", position: "", level: 70, boss: "2.660", total: "", score: "42.111.426", kills: 1, note: "" },
]; */
</script>

<style scoped lang="scss">
@include mobile-columns(("col-nick", "col-no", "col-rage", "col-rank"));
</style>
