<template>
  <div class="stat-card">
    <div class="title">{{ title }}</div>
    <div class="row">
      <div class="value">{{ value }}</div>
      <svg v-if="chart" width="60" height="32" class="mini-chart">
        <polyline points="0,30 10,25 20,28 30,18 40,10 50,15 60,5" fill="none" stroke="#4fd1c5" stroke-width="2" />
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#4fd1c5" stop-opacity="0.7" />
            <stop offset="100%" stop-color="#4fd1c5" stop-opacity="0" />
          </linearGradient>
        </defs>
        <polygon points="0,32 0,30 10,25 20,28 30,18 40,10 50,15 60,5 60,32" fill="url(#grad)" />
      </svg>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  value: String,
  chart: Boolean,
});
</script>

<style scoped>
.stat-card {
  //background: #23232e;
  //background: linear-gradient(135deg, #23232e, #2c2c3a);
  background: #4b4b4c;
  border-radius: 14px;
  padding: 14px 14px;
  min-width: 120px;
  min-height: 60px;
  flex: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
  align-items: center;
}
.title {
  font-size: 0.98rem;
  color: #bfc2e2;
  margin-bottom: 2px;
  text-align: center;
}
.row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
}
.value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  text-align: center;
}
.mini-chart {
  margin-left: 4px;
}
@media (max-width: 768px) {
  .stat-card {
    min-width: 0;
    padding: 10px 4px;
    min-height: 44px;
  }
  .title {
    font-size: 0.92rem;
  }
  .value {
    font-size: 1.1rem;
  }
  .mini-chart {
    width: 32px !important;
    height: 14px !important;
  }
}
</style>
