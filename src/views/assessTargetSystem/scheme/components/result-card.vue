<template>
  <div class="result-card">
    <zk-card>
      <template #header>
        <span class="card-header bold">评估结果</span>
      </template>
      <zk-form
        ref="resultFilterFormRef"
        v-model:form-config="resultFilterFormConfig"
        v-model:form-data="resultFilterFormData"
        inline
        label-width="100"
      ></zk-form>
      <div class="form-bths">
        <zk-button @click="resetResultFilterForm">重置</zk-button>
        <zk-button ref="" type="primary" @click="submitResultFilterForm">提交筛选</zk-button>
      </div>
      <!--结果展示-->
      <div class="result-display">
        <div class="result-chart" ref="resultChart"></div>
        <div class="result-table">
          <zk-table :columns="resultTableColumns" :data="resultTableState.totalData">
            <template #level="{ row }">
              <zk-tag :type="formatLevel(row.level)?.type">{{ formatLevel(row.level)?.text }}</zk-tag>
            </template>
          </zk-table>
        </div>
      </div>
    </zk-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { resultFilterFormConfig } from '@/views/assessTargetSystem/configs/formConfigs.ts'
import { ResultFilterFormData } from '@/views/assessTargetSystem/types.ts'
import ZkForm from '@/components/zk-form.vue'
import { useEcharts } from '@/hooks/useEcharts.ts'
import { resultChartOptions } from '@/views/assessTargetSystem/configs/chartOptions.ts'
import { resultTableColumns } from '@/views/assessTargetSystem/configs/tableConfigs.ts'
import { getAssessResultApi } from '@/api/assessTargetSystem/schema'
import { formatLevel } from '@/utils/common/formatData.ts'

interface ResultCardProps {
  searchParams: Record<string, any>
}

withDefaults(defineProps<ResultCardProps>(), {})

const resultChart = ref<NullType<HTMLDivElement>>(null)
const { renderChart } = useEcharts(resultChart)
const resultFilterFormRef = ref<InstanceType<typeof ZkForm>>()
const resultFilterFormData = reactive<ResultFilterFormData>({
  company: '',
  experts: '',
  startDate: null,
  endDate: null,
})
const resultTableState = reactive({
  totalData: [],
})

onMounted(() => {
  renderChart(resultChartOptions)
})

const getTableData = async () => {
  const res = await getAssessResultApi()
  resultTableState.totalData = res.data
}
const resetResultFilterForm = () => {
  resultFilterFormRef.value?.ElFormRef?.resetFields()
}
const submitResultFilterForm = () => {
  console.log('>>>>> file: result-card.vue ~ method: submitResultFilterForm <<<<<\n', resultFilterFormData)
}
getTableData()
</script>

<style scoped lang="scss">
.card-header {
  font-size: $font-size-l;
}

.form-bths {
  @include flex-center(row-center);

  margin-bottom: $spacing-size4;
  padding-bottom: $spacing-size4;
  border-bottom: 1px solid $border-color1;
}

.result-display {
  display: flex;
  gap: $spacing-size4;

  width: 100%;
  height: 400px;

  .result-chart {
    flex-shrink: 0;
    width: 40%;
    height: 400px;
  }

  .result-table {
    flex: 1;
    width: 400px;
    height: 400px;
  }
}
</style>
