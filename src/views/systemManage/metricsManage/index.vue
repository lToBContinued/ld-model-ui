<template>
  <div class="metrics-manage">
    <module-title
      title="多级指标管理"
      desc="配置一、二级指标及其分值，一级指标总分=100分，二级指标总分=所属一级指标分值"
    ></module-title>
    <zk-card>
      <template #header>
        <span style="font-size: 18px">请选择一个指标体系进行编辑</span>
      </template>
      <div class="select-metric-wrapper">
        <span class="label">选择指标体系</span>
        <zk-select
          v-model="metricData"
          :options="metricOptions"
          width="240px"
          placeholder="--请选择指标体系--"
        ></zk-select>
      </div>
    </zk-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getMetricOptionsApi } from '@/api/metricsManage'

const metricData = ref()
const metricOptions = ref([])

const getMetricOptions = async () => {
  const res = await getMetricOptionsApi()
  console.log('>>>>> file: index.vue ~ method: getMetricOptions <<<<<\n', res.data) // TODO: 删除
  metricOptions.value = res.data.map((item: any) => {
    return {
      label: item.metricName,
      value: item.code,
    }
  })
}

getMetricOptions()
</script>

<style scoped lang="scss">
.select-metric-wrapper {
  display: flex;
  align-items: center;

  .label {
    margin-right: $spacing-size2;
    font-size: $font-size-m;
    color: $sub-text-color4;
  }
}
</style>
