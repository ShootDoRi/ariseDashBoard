<template>
  <div class="dashboard">
    <div class="top-row">
      <StatCard title="Season48 종료일" :value="commonStore.seasonEndDate" />
      <StatCard title="남은 시간" :value="remainingTime" />
      <!-- 모바일에서만 2개씩 한 줄에 -->
      <div class="stat-row" :class="{ mobile: isMobile }">
        <StatCard title="격노 평균" :value="ariseStore.averageRage" />
        <StatCard title="레이드 참여수" :value="`(47/${ariseStore.actualParticipants})`" />
      </div>
      <PieCard />
    </div>
    <div class="table-row">
      <MemberTable />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useAriseStore } from "@/store/arise";
import { useCommonStore } from "@/store/common";
import { useIsMobile } from "@/composables/useIsMobile";
import { useRemainingTime } from "@/composables/useRemainingTime";
import StatCard from "@/components/arise/StatCard.vue";
import PieCard from "@/components/arise/PieCard.vue";
import MemberTable from "@/components/arise/MemberTable.vue";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

const ariseStore = useAriseStore();
const commonStore = useCommonStore();
const isMobile = useIsMobile();

const { remainingTime } = useRemainingTime(commonStore.endDate);
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
