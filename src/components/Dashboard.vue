<template>
  <div class="dashboard">
    <div class="top-row">
      <StatCard title="Season 종료일" :value="endDateForm" />
      <StatCard title="남은 시간" :value="remainingTime" />
      <!-- 모바일에서만 2개씩 한 줄에 -->
      <div class="stat-row" :class="{ mobile: isMobile }">
        <StatCard title="격노 평균" :value="commonStore.averageRage" />
        <StatCard title="레이드 참여수" :value="`(50/${commonStore.actualParticipants})`" />
      </div>
      <PieCard />
    </div>
    <div class="table-row">
      <MemberTable />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useCommonStore } from "../store/common";
import StatCard from "./StatCard.vue";
import PieCard from "./PieCard.vue";
import MemberTable from "./MemberTable.vue";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

const commonStore = useCommonStore();

const endDateForm = dayjs("2025-06-26T08:30:00").format("MM/DD HH:mm");
const endDateObj = dayjs("2025-06-26T08:30:00");
const endDate = endDateObj.format("MM/DD HH:mm");

const remainingTime = ref("");

function updateRemainingTime() {
  const now = dayjs();
  let diff = endDateObj.diff(now);

  if (diff < 0) {
    remainingTime.value = "종료";
    return;
  }

  const duration = dayjs.duration(diff);
  const days = Math.floor(duration.asDays());
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  remainingTime.value = `${days}일 ${hours}시 ${minutes}분 ${seconds}초`;
}

let timer;
// 모바일 여부 감지
const isMobile = ref(false);
function handleResize() {
  isMobile.value = window.innerWidth <= 768;
}
onMounted(() => {
  updateRemainingTime();
  timer = setInterval(updateRemainingTime, 1000 * 1);
  handleResize();
  window.addEventListener("resize", handleResize);
});
onUnmounted(() => {
  clearInterval(timer);
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped lang="scss">
.dashboard {
  padding: 32px 32px 0 32px;
  color: #fff;
  height: 100%;
  box-sizing: border-box;
}
.top-row {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
  align-items: stretch;
}
.table-row {
  margin-top: 12px;
}

.stat-row {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
@media (max-width: 768px) {
  .dashboard {
    padding: 12px 4px 0 4px;
  }
  .top-row {
    flex-direction: column;
    gap: 12px;
    margin-bottom: 12px;
  }
  .table-row {
    margin-top: 6px;
  }
  /* 격노 평균, 레이드 참여수 카드만 한 줄에 2개로 */
  .top-row {
    display: flex;
    flex-direction: column;
  }
  .stat-row.mobile {
    display: flex;
    flex-direction: row;
    gap: 8px;
    margin-bottom: 8px;
  }
  .stat-row.mobile > * {
    flex: 1 1 0;
    min-width: 0;
  }
}
</style>
