<template>
  <div class="evaluateResult">
    <module-title></module-title>
    <div class="page-title">评估结果</div>
    <zk-card>
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
      <div class="result-wrapper">
        <zk-table
          :columns="evaluateResultTableConfig"
          :data="tableData"
          :total="100"
          max-height="400"
          @page-change="pageChange"
        >
          <template #level="{ row }">
            <el-tag>{{ row.level }}</el-tag>
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
    <zk-card style="margin-top: 24px">
      <div class="chart" ref="resultChartInstance"></div>
    </zk-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { evaluateResultFormConfig } from '@/views/evaluateResult/configs/formConfig.ts'
import type { EvaluateResultFormType } from '@/views/evaluateResult/type.ts'
import { evaluateResultTableConfig } from '@/views/evaluateResult/configs/tableConfigs.ts'
import { useEcharts } from '@/hooks/useEcharts.ts'
import { resultChartOption } from '@/views/evaluateResult/configs/chartsOption.ts'

const resultChartInstance = ref<NullType<HTMLDivElement>>(null)
const { renderChart } = useEcharts(resultChartInstance)
const formData = ref<EvaluateResultFormType>({
  name: '',
  startDate: new Date(),
  endDate: new Date(),
  evaluateType: 0,
})
const tableData = ref([
  {
    name: '张三',
    evaluateType: 1,
    evaluateTime: [new Date(), new Date()],
    score: 80,
    level: 'A',
  },
  {
    name: '张三',
    evaluateType: 1,
    evaluateTime: [new Date(), new Date()],
    score: 80,
    level: 'A',
  },
  {
    name: '张三',
    evaluateType: 1,
    evaluateTime: [new Date(), new Date()],
    score: 80,
    level: 'A',
  },
])

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
const pageChange = (currentPage: number, pageSize: number) => {
  console.log('>>>>> file: index.vue ~ method: pageChange <<<<<\n', currentPage, pageSize) // TODO: 删除
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

  padding-bottom: $spacing-size5;
  border-bottom: 1px solid $border-color1;

  .search-form {
    display: flex;
    justify-content: center;
  }
}

.result-wrapper {
  padding-top: $spacing-size5;
}

.chart {
  width: 100%;
  height: 400px;
}
</style>
