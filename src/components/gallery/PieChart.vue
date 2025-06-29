<template>
  <div class="pie-chart-wrap">
    <Pie :data="data" :options="options" />
  </div>
</template>

<script setup>
import { Pie, Doughnut } from "vue-chartjs";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const props = defineProps({
  data: { type: Object, required: true },
});

const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "60%", // 도넛 차트로 변경
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
};
</script>

<style scoped>
.pie-chart-wrap {
  width: 80vw;
  height: 80vw;
  max-width: 100%;
  max-height: 100%;
}

@media (max-width: 600px) {
  .pie-chart-wrap {
    width: 60px;
    height: 60px;
    min-width: 40px;
    min-height: 40px;
    max-width: 80px;
    max-height: 80px;
  }
}
</style>
