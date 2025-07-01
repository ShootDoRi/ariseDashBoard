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
          <th class="col-etc" @click="sortBy('기타사항')">
            기타사항
            <span class="sort-icon" v-if="sortKey === '기타사항'">
              <span :class="{ active: sortOrder === 1 }">▲</span>
              <span :class="{ active: sortOrder === -1 }">▼</span>
            </span>
            <span class="sort-icon" v-else>▲▼</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="m in filteredData"
          :key="m.no"
          @click.stop="openUserModal(m)"
          style="cursor: pointer"
          :class="getRankClass(m.Rank)"
        >
          <td class="col-no" v-html="highlight(m['순번'])"></td>
          <td class="col-nick" v-html="highlight(m['인게임_닉'])"></td>
          <td class="col-pos" v-html="highlight(m['직위'])"></td>
          <td class="col-bc" v-html="highlight(m['배틀클래스'])"></td>
          <td class="col-raid" v-html="highlight(m['길드레이드_점수'])"></td>
          <td class="col-rage" v-html="highlight(m['격노'])"></td>
          <td class="col-rank" v-html="highlight(m['Rank'])"></td>
          <td class="col-etc" v-html="highlight(calcAlert(m))"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useGalleryStore } from "@/store/gallery";
import { useCommonStore } from "@/store/common";
import dayjs from "dayjs";
import sheetDataFlow1 from "@/json/gallery/flow/gallery_flow.json";
import sheetDataGallery from "@/json/gallery/sheet_data.json";
const galleryStore = useGalleryStore();
const commonStore = useCommonStore();

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

function calcAlert(data) {
  const rage = Number(data["격노"]);
  const total = Number(data["공헌도합"]?.replace(/,/g, ""));

  const today = dayjs();
  const warningStartDate = dayjs(galleryStore.seasonEndDate).subtract(1, "day");

  if (today.isBefore(warningStartDate)) {
    return "";
  }

  if (rage >= 135) return "";
  if (rage < 135 && total < 2420) return "경고";
  return "";
}

const filteredData = computed(() => {
  const keyword = galleryStore.searchState.keyword.trim();
  let data = galleryStore.tableData.map((row) => ({
    ...row,
    기타사항: calcAlert(row),
  }));

  if (keyword.length >= 2) {
    data = data.filter((row) =>
      Object.values(row).join(" ").toLowerCase().includes(keyword.toLowerCase())
    );
  }

  if (!sortKey.value) return data;
  return data.sort((a, b) => {
    const aVal = sortKey.value === "기타사항" ? a.기타사항 : a[sortKey.value];
    const bVal = sortKey.value === "기타사항" ? b.기타사항 : b[sortKey.value];

    if (["격노", "Rank"].includes(sortKey.value)) {
      const isEmpty = (v) =>
        v === undefined || v === null || v === "" || v === "#N/A";
      const aEmpty = isEmpty(aVal);
      const bEmpty = isEmpty(bVal);
      if (aEmpty && !bEmpty) return 1;
      if (!aEmpty && bEmpty) return -1;
      if (aEmpty && bEmpty) return 0;
      return (Number(aVal) - Number(bVal)) * sortOrder.value;
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

// 하이라이트 함수
function highlight(text) {
  const keyword = galleryStore.searchState.keyword.trim();
  if (!keyword || keyword.length < 2 || !text) return text ?? "";
  const re = new RegExp(
    `(${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  return String(text).replace(re, '<span class="highlight">$1</span>');
}

watch(
  () => galleryStore.tableData,
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
    mergedList.value.find((m) => m["인게임_닉"] === member["인게임_닉"])
  );

  const mergedData = mergedList.value.find(
    (m) => m["인게임_닉"] === member["인게임_닉"]
  );
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
  // 필요 없는 데이터 로딩 코드 삭제
});
</script>

<style scoped>
.rank-1 {
  background-color: rgba(255, 183, 77, 0.25); /* 더 밝은 오렌지색 */
  border-left: 3px solid #ffb74d;
}
.rank-2 {
  background-color: rgba(187, 134, 252, 0.25); /* 더 밝은 보라색 */
  border-left: 3px solid #bb86fc;
}
.rank-3 {
  background-color: rgba(100, 255, 218, 0.25); /* 더 밝은 청록색 */
  border-left: 3px solid #64ffda;
}

.table-wrap {
  background: #23232e;
  border-radius: 14px;
  padding: 0 0 0 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.member-table {
  width: 100%;
  border-collapse: collapse;
  background: #4b4b4c;
  color: #bbb;
  border-radius: 14px;
  overflow: hidden;
}
.member-table th,
.member-table td {
  padding: 12px 10px;
  border-bottom: 1px solid #282a36;
  text-align: center;
  font-size: 1.01rem;
}
.member-table th {
  background: #4b4b4c;
  color: #bbb;
  font-weight: 600;
}
.member-table tr:last-child td {
  border-bottom: none;
}
.note-btn {
  background: #23232e;
  color: #4fd1c5;
  border: 1px solid #4fd1c5;
  border-radius: 6px;
  padding: 2px 10px;
  font-size: 0.98rem;
  cursor: pointer;
}
:deep(tbody) {
  td {
    span.highlight {
      background-color: #fff9c0 !important;
      color: #222;
      border-radius: 3px;
      padding: 0 2px;
    }
  }
}
@media (max-width: 768px) {
  .table-wrap {
    overflow-x: auto;
    padding: 0;
  }
  .member-table {
    min-width: unset;
    width: 100%;
    font-size: 0.95rem;
    table-layout: fixed;
  }
  .member-table th,
  .member-table td {
    padding: 7px 6px;
    font-size: 0.92rem;
    width: auto;
    word-break: break-all;
  }
  /* 숨길 컬럼 */

  .col-pos,
  .col-bc,
  .col-raid,
  .col-etc {
    display: none;
  }
  /* 보일 컬럼: 순번, 격노, Rank */
  .col-nick,
  .col-no,
  .col-rage,
  .col-rank {
    display: table-cell;
    width: 33.33%;
  }
}
.sort-icon {
  font-size: 0.85em;
  margin-left: 4px;
  color: #bfc2e2;
  letter-spacing: -2px;
  user-select: none;
}
.sort-icon .active {
  color: #4fd1c5;
  font-weight: bold;
}
</style>
