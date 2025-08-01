<template>
  <div class="evaluate-trends">
    <zk-card>
      <div class="title">评估趋势</div>
      <div class="chart" ref="trendInstance"></div>
    </zk-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useEcharts } from '@/hooks/useEcharts.ts'
import { trendChartOptions } from '@/views/home/configs/chartsOptions.ts'

const trendInstance = ref<NullType<HTMLDivElement>>(null)
const { renderChart } = useEcharts(trendInstance)

onMounted(() => {
  renderChart(trendChartOptions)
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
  height: 300px;
}
</style>
