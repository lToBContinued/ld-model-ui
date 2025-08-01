<template>
  <div class="ability-analysis">
    <zk-card>
      <div class="title">能力分布分析</div>
      <div class="chart" ref="abilityInstance"></div>
    </zk-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { abilityChartOptions } from '@/views/home/configs/chartsOptions.ts'
import { useEcharts } from '@/hooks/useEcharts.ts'

const abilityInstance = ref<NullType<HTMLDivElement>>(null)
const { renderChart } = useEcharts(abilityInstance)

onMounted(() => {
  renderChart(abilityChartOptions)
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
    height: 300px;
  }
}

::v-deep(.el-card__body) {
  height: 100%;
}
</style>
