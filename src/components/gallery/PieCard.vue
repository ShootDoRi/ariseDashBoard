<template>
  <div class="pie-card">
    <div class="pie-title">격노 구간</div>
    <div class="container">
      <div class="pie-legend">
        <div v-for="(itm, idx) in pieData.labels" :key="`data-${idx}`">
          <span :class="`dot dot${idx + 1}`" />{{ itm }}
        </div>
        <!-- <div><span class="dot dot1"></span>0-199</div>
        <div><span class="dot dot2"></span>200-249</div>
        <div><span class="dot dot3"></span>250-299</div>
        <div><span class="dot dot4"></span>300+</div> -->
      </div>
      <div class="pie-chart">
        <PieChart :data="pieData" width="80px" height="80px" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from "vue";
import PieChart from "./PieChart.vue";
import { useGalleryStore } from "@/store/gallery";

const galleryStore = useGalleryStore();
/* const pieData = {
  labels: ["0-199", "200-249", "250-299", "300+"],
  datasets: [
    {
      data: [32, 27, 20, 21],
      backgroundColor: ["#6c63ff", "#7c7bff", "#a29bfe", "#4fd1c5"],
    },
  ],
}; */

// 격노 값의 최소/최대에 따라 4구간으로 자동 분할
const pieData = computed(() => {
  const rageKeys = Object.keys(galleryStore.rageCountData)
    .map(Number)
    .filter((v) => !isNaN(v))
    .sort((a, b) => a - b);

  if (rageKeys.length === 0) {
    return {
      labels: [],
      datasets: [{ data: [], backgroundColor: [] }],
    };
  }

  const min = rageKeys[0];
  const max = rageKeys[rageKeys.length - 1];
  const range = max - min;
  const step = Math.ceil(range / 4) || 1;

  // 구간 라벨 생성
  const bins = [];
  const labels = [];
  for (let i = 0; i < 4; i++) {
    const start = min + step * i;
    const end = i === 3 ? max : min + step * (i + 1) - 1;
    bins.push({ start, end, count: 0 });
    labels.push(`${start}~${end}`);
  }

  // 각 rage 값을 해당 구간에 카운트
  rageKeys.forEach((rage) => {
    const count = galleryStore.rageCountData[rage];
    for (let i = 0; i < bins.length; i++) {
      if (rage >= bins[i].start && rage <= bins[i].end) {
        bins[i].count += count;
        break;
      }
    }
  });

  const data = bins.map((bin) => bin.count);
  const colors = ["#0088ff", "#01CAD1", "#00D17A", "#FFD324"];

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
      },
    ],
  };
});

watch(
  () => pieData.value.labels,
  () => {
    console.log("Pie data updated:", pieData.value);
  },
  { immediate: true, deep: true }
);
</script>

<style scoped lang="scss">
.pie-card {
  //background: #23232e;
  background: #4b4b4c;
  border-radius: 14px;
  padding: 24px 20px;
  min-width: 220px;
  min-height: 200px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.pie-title {
  font-size: 1.05rem;
  color: #bfc2e2;
  margin-bottom: 6px;
  align-self: flex-start;
}
/* .pie-legend {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.98rem;
  color: #bfc2e2;
  align-self: flex-start;
} */
.pie-legend {
  display: flex;
  flex-wrap: wrap; /* 여러 줄 허용 */
  //gap: 4px 16px; /* 행, 열 간격 */
  gap: 2px;
  font-size: 0.98rem;
  color: #bfc2e2;
  align-self: center;
  //justify-content: center;
}

.container {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 85%;
}

.pie-legend > div {
  width: 33%; /* 한 줄에 2개씩 */
  display: flex;
  align-items: center;
}
.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
}
.dot1 {
  background: #0088ff;
}
.dot2 {
  background: #01cad1;
}
.dot3 {
  background: #00d17a;
}
.dot4 {
  background: #ffd324;
}
.pie-chart {
  width: 120px;
  height: 120px;
  margin-top: 8px;
}
@media (max-width: 768px) {
  .pie-card {
    min-width: 0;
    min-height: 120px;
    padding: 10px 4px;
  }
  .pie-title {
    font-size: 0.95rem;
  }
  .pie-legend {
    font-size: 0.92rem;
  }
  .pie-chart {
    width: 70px;
    height: 70px;
  }
}
</style>
