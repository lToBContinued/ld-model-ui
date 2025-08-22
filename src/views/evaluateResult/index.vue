<template>
  <div class="evaluateResult">
    <zk-card class="module-bottom">
      <div class="search-wrapper">
        <zk-form
          class="search-form"
          ref="ZkFormRef"
          :form-config="evaluateResultFormConfig"
          :form-data="formData"
          label-width="120"
          inline
        ></zk-form>
        <div class="btn-group">
          <zk-button @click="reset">重置</zk-button>
          <zk-button type="primary" @click="submitForm">确定</zk-button>
        </div>
      </div>
    </zk-card>
    <zk-card class="module-bottom">
      <template #header>
        <span class="card-title">评估分布</span>
      </template>
      <div class="chart" ref="resultChartInstance"></div>
    </zk-card>
    <zk-card class="module-bottom">
      <div class="result-wrapper">
        <zk-table
          :columns="evaluateResultTableConfig"
          :data="tableData"
          :total="state.total"
          max-height="400"
          v-model:current-page="state.currentPage"
          v-model:page-size="state.pageSize"
        >
          <template #level="{ row }">
            <zk-tag :type="formatLevel(row.level)?.type">{{ formatLevel(row.level)?.label }}</zk-tag>
          </template>
          <template #operation>
            <div class="btn-group">
              <zk-button type="primary">查看</zk-button>
              <zk-button type="success">导出</zk-button>
            </div>
          </template>
        </zk-table>
      </div>
    </zk-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import { evaluateResultFormConfig } from '@/views/evaluateResult/configs/formConfig.ts'
import type { EvaluateResultFormType } from '@/views/evaluateResult/type.ts'
import { evaluateResultTableConfig } from '@/views/evaluateResult/configs/tableConfigs.ts'
import { useEcharts } from '@/hooks/useEcharts.ts'
import { resultChartOption } from '@/views/evaluateResult/configs/chartsOption.ts'

const resultChartInstance = ref<NullType<HTMLDivElement>>(null)
const { renderChart } = useEcharts(resultChartInstance, { themeMode: 'dark' })
const formData = ref<EvaluateResultFormType>({
  companyName: '',
  startDate: new Date(),
  endDate: new Date(),
  subject: '',
})
const state = reactive({
  totalData: Array.from({ length: 100 }, (_, index) => ({
    name: `用户${index + 1}`,
    evaluateType: 1,
    evaluateTime: [new Date(), new Date()],
    score: 80,
    level: 1,
  })),
  pageSize: 10,
  currentPage: 1,
  total: 100,
})
const tableData = computed(() => {
  return state.totalData.slice((state.currentPage - 1) * state.pageSize, state.currentPage * state.pageSize)
})

onMounted(() => {
  renderChart(resultChartOption)
})

const submitForm = async () => {
  console.log('>>>>> file: index.vue ~ method: submitForm <<<<<\n', formData.value) // TODO: 删除
}
const reset = () => {
  Object.assign(formData.value, {
    name: '',
    startDate: new Date(),
    endDate: new Date(),
    evaluateType: '',
  })
}
const formatLevel = (level: number) => {
  switch (level) {
    case 1:
      return {
        type: 'success',
        label: '优秀',
      }
    case 2:
      return {
        type: 'warning',
        label: '良好',
      }
    case 3:
      return {
        type: 'danger',
        label: '合格',
      }
    default:
      return {
        type: 'success',
        label: '合格',
      }
  }
}
</script>

<style scoped lang="scss">
.page-title {
  margin-bottom: $spacing-size5;
  font-size: $title-size-l;
  font-weight: 700;
}

.search-wrapper {
  @include flex-center(col-center);

  .search-form {
    display: flex;
    justify-content: center;
  }
}

.chart {
  width: 100%;
  height: 400px;
}
</style>
