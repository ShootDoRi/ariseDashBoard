<template>
  <div class="table-wrap">
    <table class="member-table">
      <thead>
        <tr>
          <th class="col-no" @click="sortBy('순번')">순번</th>
          <th class="col-nick" @click="sortBy('인게임_닉')">인게임_닉</th>
          <th class="col-tag" @click="sortBy('태그')">태그</th>
          <th class="col-gal" @click="sortBy('갤닉')">갤닉</th>
          <th class="col-pos" @click="sortBy('직위')">직위</th>
          <th class="col-bc" @click="sortBy('배틀클래스')">배클</th>
          <th class="col-boss" @click="sortBy('보스공헌도')">보스공헌도</th>
          <th class="col-mission" @click="sortBy('미션공헌도')">미션공헌도</th>
          <th class="col-total" @click="sortBy('공헌도합')">공헌도합</th>
          <th class="col-raid" @click="sortBy('길드레이드_점수')">길드레이드_점수</th>
          <th class="col-rage" @click="sortBy('격노')">격노</th>
          <th class="col-rank" @click="sortBy('Rank')">Rank</th>
          <th class="col-etc">기타사항</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="m in sortedData" :key="m.no">
          <td class="col-no">{{ m["순번"] }}</td>
          <td class="col-nick">{{ m["인게임_닉"] }}</td>
          <td class="col-tag">{{ m["태그"] }}</td>
          <td class="col-gal">{{ m["갤닉"] }}</td>
          <td class="col-pos">{{ m["직위"] }}</td>
          <td class="col-bc">{{ m["배틀클래스"] }}</td>
          <td class="col-boss">{{ m["보스공헌도"] }}</td>
          <td class="col-mission">{{ m["미션공헌도"] }}</td>
          <td class="col-total">{{ m["공헌도합"] }}</td>
          <td class="col-raid">{{ m["길드레이드_점수"] }}</td>
          <td class="col-rage">{{ m["격노"] }}</td>
          <td class="col-rank">{{ m["Rank"] }}</td>
          <td class="col-etc">
            <button v-if="m.note === 'Check'" class="note-btn">Check</button>
            <input v-else type="checkbox" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useCommonStore } from "../store/common";
const commonStore = useCommonStore();

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

const sortedData = computed(() => {
  const data = [...commonStore.tableData];
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

watch(
  () => commonStore.tableData,
  (newData) => {
    console.log("Table data updated:", newData);
  },
  { immediate: true, deep: true }
);

const members = ref([]);

onMounted(() => {
  /* members.value = sheetData.map((itm) => {
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

<style scoped>
.table-wrap {
  background: #23232e;
  border-radius: 14px;
  padding: 0 0 0 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.member-table {
  width: 100%;
  border-collapse: collapse;
  background: #23232e;
  color: #fff;
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
  background: #23232e;
  color: #bfc2e2;
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
@media (max-width: 768px) {
  .table-wrap {
    overflow-x: auto;
    padding: 0;
  }
  .member-table {
    min-width: unset;
    width: 100%;
    font-size: 0.95rem;
    table-layout: fixed; /* 각 컬럼이 균등하게 분배됨 */
  }
  .member-table th,
  .member-table td {
    padding: 7px 6px;
    font-size: 0.92rem;
    width: auto;
    word-break: break-all;
  }
  /* 숨길 컬럼 */
  .col-nick,
  .col-tag,
  .col-pos,
  .col-bc,
  .col-boss,
  .col-mission,
  .col-total,
  .col-raid,
  .col-etc {
    display: none;
  }
  /* 보일 컬럼: 순번, 갤닉, 격노, Rank */
  .col-no,
  .col-gal,
  .col-rage,
  .col-rank {
    display: table-cell;
    width: 25%; /* 4개 컬럼이 균등하게 분배 */
  }
}
</style>
