<template>
  <div class="dialog-backdrop" :class="{ active: commonStore.modalState.isOpen }" @click.self="closeDialog">
    <div class="dialog" :class="{ active: commonStore.modalState.isOpen }">
      <h3>유저 상세 정보</h3>
      <ul>
        <li><strong>인게임_닉:</strong> {{ userData?.nick }}</li>
        <li><strong>태그:</strong> {{ userData?.tag }}</li>
        <li><strong>갤닉:</strong> {{ userData?.gal }}</li>
        <li><strong>직위:</strong> {{ userData?.pos }}</li>
        <li><strong>배틀클래스:</strong> {{ userData?.배틀클래스 }}</li>
      </ul>
      <!-- 차트 컨테이너 수정 -->
      <div class="chart-container" v-if="weekChart.labels.length" style="margin-top: 24px">
        <div class="chart-scroll">
          <Line :data="chartData" :options="chartOptions" :style="chartStyle" />
        </div>
      </div>
      <button @click="closeDialog">닫기</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useCommonStore } from "@/store/common";
import { useRoute } from "vue-router";
import { Line } from "vue-chartjs";
import { Chart, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

const commonStore = useCommonStore();
const route = useRoute();

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
    .sort(([a], [b]) => Number(a.replace("주차", "")) - Number(b.replace("주차", "")));
  return {
    labels: weekEntries.map(([key]) => key),
    data: weekEntries.map(([_, val]) => Number(val)),
  };
});

// 차트 스타일을 동적으로 계산
const chartStyle_ = computed(() => {
  const dataCount = weekChart.value.labels.length;
  const minWidth = Math.max(300, dataCount * 40); // 주차당 80px씩 할당, 최소 500px

  return {
    minWidth: `${minWidth}px`,
    width: `${minWidth}px`,
    height: "340px",
  };
});

// 차트 스타일을 동적으로 계산 - 높이 증가
const chartStyle = computed(() => {
  const dataCount = weekChart.value.labels.length;
  const minWidth = Math.max(300, dataCount * 40);

  return {
    minWidth: `${minWidth}px`,
    width: `${minWidth}px`,
    height: "500px", // 340px → 500px로 증가
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

const chartOptions = computed(() => {
  let scaleRange = {
    min: 110,
    max: 160,
  };

  if (route.path === "/gallery") {
    scaleRange = {
      min: 125,
      max: 165,
    };
  }

  return {
    responsive: true,
    maintainAspectRatio: false, // 가로 스크롤을 위해 비율 유지 해제
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      datalabels: {
        anchor: "end",
        align: "end",
        color: "#fff",
        backgroundColor: "rgba(79, 209, 197, 0.3)",
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
        min: scaleRange.min,
        max: scaleRange.max,
        title: { display: true, text: "격노수" },
      },
      x: {
        title: { display: true, text: "주차" },
        // x축 라벨이 겹치지 않도록 설정
        ticks: {
          maxRotation: 45,
          minRotation: 0,
        },
      },
    },
  };
});
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

  // 모바일에서 스크롤 가능하도록 수정
  @media (max-width: 767px) {
    align-items: flex-start; // 상단 정렬로 변경
    overflow-y: auto; // 세로 스크롤 활성화
    padding: 20px 0; // 상하 여백
  }

  .dialog {
    transform: scale(0.85);
    opacity: 0;
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s;
    pointer-events: none;

    // PC에서는 처음부터 80vw 크기로 시작
    @media (min-width: 768px) {
      width: 80vw;
      max-width: 80vw;
      transform: scale(1);
    }
  }

  &.active {
    background: rgba(0, 0, 0, 0.45);
    opacity: 1;
    pointer-events: auto;

    .dialog {
      transform: scale(1);
      opacity: 1;
      pointer-events: auto;

      @media (min-width: 768px) {
        transform: scale(1);
      }
    }
  }
}

.dialog {
  background: #23232e;
  color: #fff;
  border-radius: 12px;
  padding: 24px 18px;
  min-width: 400px;
  max-width: 90vw;
  max-height: 90vh;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18);
  overflow: hidden;

  // PC 화면에서의 스타일
  @media (min-width: 768px) {
    min-width: 80vw;
    width: 80vw;
    max-width: 80vw;
  }

  // 모바일에서 스타일 수정
  @media (max-width: 767px) {
    min-width: 0;
    max-width: 95vw;
    width: 95vw;
    max-height: none; // 높이 제한 제거
    min-height: auto; // 최소 높이 자동
    padding: 16px;
    margin: 20px auto; // 상하 마진으로 여백 확보
    overflow: visible; // overflow 해제
  }
}

.dialog ul {
  padding-left: 27px;
  margin: 0 0 16px 0;
  list-style: none;
  text-align: left;
}

.dialog ul li {
  text-align: left;
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

  // 모바일에서 버튼을 더 잘 보이게
  @media (max-width: 767px) {
    margin-top: 24px;
    margin-bottom: 8px; // 하단 여백 추가
    padding: 12px 24px; // 패딩 증가
    font-size: 1.1rem; // 폰트 크기 증가
    width: 100%; // 전체 너비
  }
}

// 차트 컨테이너 스타일 수정
.chart-container {
  width: 95%;
  max-width: 95%;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 16px 8px;
  margin: 24px auto;
  border: 1px solid #4fd1c5;
  border-radius: 8px;
  min-height: 520px;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #2a2a35;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #4fd1c5;
    border-radius: 4px;

    &:hover {
      background: #3ba89a;
    }
  }
}

.chart-scroll {
  display: block;
  width: fit-content;
  min-width: 100%;
  height: 500px;
}

// 모바일에서 차트 크기 조정
@media (max-width: 767px) {
  .chart-container {
    border: 1px solid #4fd1c5;
    min-height: 350px; // 높이 줄임
    padding: 12px 4px;
    margin: 16px 0; // 마진 줄임
  }

  .chart-scroll {
    min-width: 350px; // 너비 줄임
    height: 300px; // 높이 줄임
  }

  // 모바일에서 차트 스타일 조정
  .chart-scroll canvas {
    height: 300px !important;
  }
}

// PC에서 차트가 더 크게 보이도록
@media (min-width: 768px) {
  .chart-container {
    width: 95%;
    max-width: 95%;
    margin: 32px auto;
    padding: 20px 12px;
  }
}
</style>
