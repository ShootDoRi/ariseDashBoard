<template>
  <div style="width: 80px; height: 80px">
    <Pie :data="data" :options="options" />
  </div>
</template>

<script setup>
import { Pie } from "vue-chartjs";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const props = defineProps({
  data: { type: Object, required: true },
});

const options = {
  responsive: true,
  maintainAspectRatio: false, // 추가: 부모 크기에 맞게

  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
};
</script>
