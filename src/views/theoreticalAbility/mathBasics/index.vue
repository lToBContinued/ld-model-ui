<template>
  <div class="logicReason">
    <zk-card>
      <module-title title="数学基础" desc="数学基础详情"></module-title>
    </zk-card>
    <zk-card class="content-card">
      <div class="basic-info content-box">基础信息</div>
      <div class="math-basic content-box">数学基础</div>
      <div class="logical-ability content-box">逻辑推理</div>
    </zk-card>
    <zk-card class="content-card">
      <div class="charts-wrapper">
        <div class="left charts-box" id="math-left-charts"></div>
        <div class="right charts-box" id="math-right-charts"></div>
      </div>
    </zk-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import * as echarts from 'echarts'
import { mathLeftChartOption, mathRightChartsOption } from '@/views/theoreticalAbility/mathBasics/charts.ts'

onMounted(() => {
  const leftChartsDom = document.getElementById('math-left-charts')
  const leftCharts = echarts.init(leftChartsDom)
  leftCharts.setOption(mathLeftChartOption)

  const rightChartsDom = document.getElementById('math-right-charts')
  const rightCharts = echarts.init(rightChartsDom)
  rightCharts.setOption(mathRightChartsOption)
})
</script>

<style scoped lang="scss">
.logicReason {
  padding: $spacing-size2;
}

.content-card {
  margin-top: $spacing-size2;
}

.content-box {
  width: 100%;
  margin-bottom: $spacing-size5;
  padding: $spacing-size4;

  border: 1px solid $border-color1;
  border-radius: $border-radius-size-s;
}

.charts-wrapper {
  display: flex;
  gap: 10px;

  .charts-box {
    flex: 1;
    width: 100%;
    height: 600px;
    border: 1px solid $border-color1;
  }
}
</style>
