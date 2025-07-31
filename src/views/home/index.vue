<template>
  <div>
    <module-title></module-title>
    <div class="overview-wrapper">
      <statistics-card :data="overviewData" class="overview-card"></statistics-card>
      <statistics-card :data="overviewData" class="overview-card"></statistics-card>
      <statistics-card :data="overviewData" class="overview-card"></statistics-card>
    </div>
    <div class="charts-wrapper">
      <!--能力分布-->
      <ability-analysis class="chart-item"></ability-analysis>
      <!--评估趋势-->
      <evaluate-trends class="chart-item"></evaluate-trends>
    </div>
    <!--最近评估记录-->
    <recent-records></recent-records>
  </div>
</template>

<script setup lang="ts">
import StatisticsCard from '@/views/home/components/statistics-card.vue'
import AbilityAnalysis from '@/views/home/components/ability-analysis.vue'
import EvaluateTrends from '@/views/home/components/evaluate-trends.vue'
import RecentRecords from '@/views/home/components/recent-records.vue'

const overviewData = {
  title: '总评估人数',
  value: 124,
  desc: '本月新增：18',
}
</script>

<style scoped lang="scss">
.overview-wrapper {
  display: flex;
  gap: $spacing-size5;
  margin-bottom: $spacing-size5;

  .overview-card {
    flex: 1;
    height: 150px;
  }
}

.charts-wrapper {
  display: flex;
  gap: $spacing-size4;

  .chart-item {
    flex: 1;
  }
}
</style>
