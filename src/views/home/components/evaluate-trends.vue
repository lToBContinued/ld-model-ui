<template>
  <div class="evaluate-trends">
    <zk-card>
      <div class="title">评估趋势</div>
      <div class="chart" id="trendChart"></div>
    </zk-card>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted } from 'vue'
import { trendChartOptions } from '@/views/home/chartsOptions.ts'

onMounted(() => {
  const trendChartDom = document.getElementById('trendChart')
  if (trendChartDom) {
    const trendChart = echarts.init(trendChartDom)
    trendChart.setOption(trendChartOptions)
  }
})
</script>

<style scoped lang="scss">
.evaluate-trends {
  height: 400px;
  margin-bottom: $spacing-size5;

  .title {
    margin-bottom: $spacing-size5;
    padding-bottom: $spacing-size3;

    font-size: $font-size-l;
    font-weight: 700;

    border-bottom: 1px solid $border-color1;
  }
}

.chart {
  width: 100%;
  height: 300px;
}
</style>
