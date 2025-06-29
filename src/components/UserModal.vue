<template>
  <div
    class="dialog-backdrop"
    :class="{ active: commonStore.modalState.isOpen }"
    @click.self="closeDialog"
  >
    <div class="dialog" :class="{ active: commonStore.modalState.isOpen }">
      <h3>유저 상세 정보</h3>
      <ul>
        <li><strong>인게임_닉:</strong> {{ userData?.nick }}</li>
        <li><strong>태그:</strong> {{ userData?.tag }}</li>
        <li><strong>갤닉:</strong> {{ userData?.gal }}</li>
        <li><strong>직위:</strong> {{ userData?.pos }}</li>
        <li><strong>배틀클래스:</strong> {{ userData?.배틀클래스 }}</li>
        <!-- <li><strong>Rank:</strong> {{ userData?.rank }}</li> -->
      </ul>
      <!-- 선 그래프(가로형) 추가 -->
      <div v-if="weekChart.labels.length" style="margin-top: 24px">
        <Line
          :data="chartData"
          :options="chartOptions"
          style="max-width: 400px"
        />
      </div>
      <button @click="closeDialog">닫기</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useCommonStore } from "../store/common";
import { Line } from "vue-chartjs";
import {
  Chart,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // 추가

Chart.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartDataLabels // 플러그인 등록
);

const commonStore = useCommonStore();

function closeDialog() {
  commonStore.modalState.isOpen = false;
  commonStore.modalState.user = null;
}

const userData = computed(() => {
  if (!commonStore.modalState?.userData) return false;
  const { userData } = commonStore.modalState;
  return {
    ...userData,
    nick: userData["인게임_닉"],
    tag: userData["태그"],
    gal: userData["갤닉"],
    pos: userData["직위"],
    rank: userData["Rank"],
    배틀클래스: userData["배틀클래스"],
  };
});

const weekChart = computed(() => {
  if (!userData.value) return { labels: [], data: [] };
  const weekEntries = Object.entries(userData.value)
    .filter(([key, val]) => /^\d+주차$/.test(key) && !isNaN(Number(val)))
    .sort(
      ([a], [b]) =>
        Number(a.replace("주차", "")) - Number(b.replace("주차", ""))
    );
  return {
    labels: weekEntries.map(([key]) => key),
    data: weekEntries.map(([_, val]) => Number(val)),
  };
});

const chartData = computed(() => ({
  labels: weekChart.value.labels,
  datasets: [
    {
      label: "주차별 격노수",
      data: weekChart.value.data,
      borderColor: "#4fd1c5",
      backgroundColor: "#4fd1c5",
      fill: false,
      tension: 0.2,
      pointRadius: 4,
      pointBackgroundColor: "#fff",
      pointBorderColor: "#4fd1c5",
    },
  ],
}));

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
    datalabels: {
      anchor: "end",
      align: "end",
      color: "#fff",
      //backgroundColor: "#4fd1c5",
      backgroundColor: "rgba(79, 209, 197, 0.3)", // 흐린 배경색으로 변경
      borderRadius: 4,
      font: { weight: "bold" },
      offset: 8,
      formatter: function (value) {
        return value;
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      min: 110,
      max: 160,
      title: { display: true, text: "격노수" },
    },
    x: { title: { display: true, text: "주차" } },
  },
};
</script>

<style scoped lang="scss">
.dialog-backdrop {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  opacity: 0;
  transition: background 0.25s, opacity 0.25s;
  .dialog {
    transform: scale(0.85);
    opacity: 0;
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s;
    pointer-events: none;
  }
  &.active {
    background: rgba(0, 0, 0, 0.45);
    opacity: 1;
    pointer-events: auto;
    .dialog {
      transform: scale(1);
      opacity: 1;
      pointer-events: auto;
    }
  }
}
.dialog {
  background: #23232e;
  color: #fff;
  border-radius: 12px;
  padding: 24px 18px;
  //min-width: 260px;
  min-width: 80vw;
  max-width: 80vw;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18);
}

.dialog ul {
  padding-left: 27px;
  margin: 0 0 16px 0;
  list-style: none;
  text-align: left; // 왼쪽 정렬
}
.dialog ul li {
  text-align: left; // 왼쪽 정렬
  margin-bottom: 6px;
}

.dialog button {
  margin-top: 18px;
  background: #4fd1c5;
  color: #23232e;
  border: none;
  border-radius: 6px;
  padding: 6px 18px;
  font-size: 1rem;
  cursor: pointer;
}
</style>
