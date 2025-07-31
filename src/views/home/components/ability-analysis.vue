<template>
  <div class="ability-analysis">
    <zk-card>
      <div class="title">能力分布分析</div>
      <div class="chart" id="abilityChart"></div>
    </zk-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import * as echarts from 'echarts'
import { abilityChartOptions } from '@/views/home/chartsOptions.ts'

onMounted(() => {
  const abilityChartDom = document.getElementById('abilityChart')
  if (abilityChartDom) {
    const abilityChart = echarts.init(abilityChartDom)
    abilityChart.setOption(abilityChartOptions)
  }
})
</script>

<style scoped lang="scss">
.ability-analysis {
  height: 400px;
  margin-bottom: $spacing-size5;

  .title {
    margin-bottom: $spacing-size5;
    padding-bottom: $spacing-size3;

    font-size: $font-size-l;
    font-weight: 700;

    border-bottom: 1px solid $border-color1;
  }

  .chart {
    width: 100%;
    height: 300px;
  }
}

::v-deep(.el-card__body) {
  height: 100%;
}
</style>
