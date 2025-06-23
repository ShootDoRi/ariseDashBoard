<template>
  <div class="dashboard">
    <div class="top-row">
      <StatCard title="Season 종료일" :value="endDateForm" />
      <StatCard title="남은 시간" :value="remainingTime" />
      <StatCard title="격노 평균" :value="commonStore.averageRage" />
      <!-- <StatCard title="레이드 참여수" value="(50/10)" chart /> -->
      <StatCard title="레이드 참여수" :value="`(50/${commonStore.actualParticipants})`" />
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
onMounted(() => {
  updateRemainingTime();
  //timer = setInterval(updateRemainingTime, 1000 * 30); // 30초마다 갱신
  timer = setInterval(updateRemainingTime, 1000 * 1); // 1초마다 갱신
});
onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
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
}
</style>
