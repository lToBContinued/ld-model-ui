<template>
  <div class="theoretical-research-results">
    <module-title title="人才评估系统"></module-title>
    <div class="page-title">理论研究成果评估</div>
    <zk-card class="card-wrapper">
      <template #header>
        <div class="card-header">
          <span>理论研究成果评估表</span>
        </div>
      </template>
      <!--评估表单-->
      <div class="assess-wrapper">
        <zk-form
          class="assess-form"
          ref="assessFromRef"
          :form-config="theoryKnowledgeAssessFormConfig"
          :form-data="assessFormData"
          :rules="assessFormRules"
          label-width="140"
          inline
        ></zk-form>
        <div class="btn-group">
          <zk-button @click="resetAssessForm">重置</zk-button>
          <zk-button type="primary" @click="submitAssessForm">确定</zk-button>
        </div>
      </div>
    </zk-card>
    <zk-card class="card-wrapper">
      <template #header>
        <div class="card-header">
          <span>评估结果</span>
        </div>
      </template>
      <!--搜索表单-->
      <div class="search-wrapper">
        <zk-form
          class="search-form"
          ref="searchFormRef"
          :form-config="theoryKnowledgeSearchFormConfig"
          :form-data="searchFormData"
          :rules="searchFormRules"
          label-width="140"
          inline
        ></zk-form>
        <div class="btn-group">
          <zk-button @click="resetSearchForm">重置</zk-button>
          <zk-button type="primary" @click="submitSearchForm">确定</zk-button>
        </div>
      </div>
      <!--结果表格-->
      <div class="result-wrapper">
        <div class="result-chart" ref="resultChart"></div>
        <div class="result-table">
          <p class="table-title bold">评估详情</p>
          <zk-table
            :data="tableData"
            :columns="resultTableColumns"
            :total="state.total"
            row-key="id"
            :reserve-selection="true"
            :selected-rows="state.selectedRows"
            show-tools
            v-model:current-page="state.currentPage"
            v-model:page-size="state.pageSize"
            @selection-change="selectChange"
            max-height="200px"
          >
            <template #level="{ row }">
              <el-tag :type="formatLevel(row.level)?.type">{{ formatLevel(row.level)?.desc }} </el-tag>
            </template>
          </zk-table>
          <div class="statistics">
            <div class="statistics-desc">
              <p class="total-score total">
                <span class="bold">总分：</span>
                0.00/100
              </p>
              <p class="total-level total">
                <span class="bold">评估等级：</span>
                不合格
              </p>
            </div>
          </div>
        </div>
      </div>
    </zk-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch, reactive } from 'vue'
import type { FormRules } from 'element-plus'
import {
  theoryKnowledgeAssessFormConfig,
  theoryKnowledgeSearchFormConfig,
} from '@/views/theoryKnowledge/configs/formConfig.ts'
import { theoryKnowledgeAccessFormType, theoryKnowledgeSearchFormType } from '@/views/theoryKnowledge/type.ts'
import type ZkForm from '@/components/zk-form.vue'
import { useEcharts } from '@/hooks/useEcharts.ts'
import { theoryKnowledgeResultChartOptions } from '@/views/theoryKnowledge/configs/chartOptions.ts'
import { resultTableColumns } from '@/views/theoryKnowledge/configs/tableConfigs.ts'
import ZkTable from '@/components/zk-table.vue'

const resultChart = ref<NullType<HTMLDivElement>>(null)
const { renderChart } = useEcharts(resultChart)
const assessFromRef = ref<InstanceType<typeof ZkForm>>()
const searchFormRef = ref<InstanceType<typeof ZkForm>>()
const assessFormData = ref<theoryKnowledgeAccessFormType>({
  company: '',
  companyNumber: '',
  targeted: 0,
  comprehensive: 0,
  accuracy: 0,
  supportive: 0,
  remark: '',
})
const searchFormData = ref<theoryKnowledgeSearchFormType>({
  company: '',
  startDate: new Date(),
  endDate: new Date(),
})
const assessFormRules: FormRules<theoryKnowledgeAccessFormType> = {
  company: [{ required: true, message: '请输入评估单位', trigger: 'blur' }],
  companyNumber: [{ required: true, message: '请输入单位编号', trigger: 'blur' }],
}
const searchFormRules: FormRules<theoryKnowledgeSearchFormType> = {
  company: [{ required: true, message: '请选择评估单位', trigger: 'blur' }],
}

const state = reactive({
  currentPage: 1,
  selectedRows: [], //用于存储选中的每一行
  pageSize: 10,
  totalData: Array.from({ length: 1000 }, (_, index) => {
    return {
      id: Number(index + 1),
      project: '项目' + Number(index + 1),
      score: 80,
      level: 3,
    }
  }),
  total: 1000,
})

const tableData = computed(() => {
  return state.totalData.slice((state.currentPage - 1) * state.pageSize, state.currentPage * state.pageSize)
})

onMounted(() => {
  renderChart(theoryKnowledgeResultChartOptions)
})

const formatLevel = (level: number) => {
  if (level === 1) {
    return {
      type: 'success',
      desc: '优秀',
    }
  }
  if (level === 2) {
    return {
      type: 'warning',
      desc: '基本合格',
    }
  }
  if (level === 3) {
    return {
      type: 'danger',
      desc: '不合格',
    }
  }
}
const submitAssessForm = async () => {
  try {
    await assessFromRef.value?.ElFormRef?.validate()
    console.log('>>>>> file: index.vue ~ method: submitForm <<<<<\n', assessFormData.value) // TODO: 删除
  } catch (e) {
    console.log(e)
  }
}
const resetAssessForm = () => {
  assessFromRef.value?.ElFormRef?.resetFields()
}
const selectChange = (newSelection: any[]) => {
  ;(state.selectedRows as any[]) = newSelection
}
const submitSearchForm = async () => {
  try {
    await searchFormRef.value?.ElFormRef?.validate()
    console.log('>>>>> file: index.vue ~ method: submitForm <<<<<\n', assessFormData.value) // TODO: 删除
  } catch (e) {
    console.log(e)
  }
}
const resetSearchForm = () => {
  searchFormRef.value?.ElFormRef?.resetFields()
}
</script>

<style scoped lang="scss">
.page-title {
  margin-bottom: $spacing-size5;
  font-size: $title-size-l;
  font-weight: 700;
}

.card-wrapper {
  margin-bottom: $spacing-size4;
}

.card-header {
  font-size: $font-size-l;
  font-weight: 700;
}

.assess-wrapper {
  @include flex-center(col-center);

  padding-bottom: $spacing-size5;

  .assess-form {
    display: flex;
    justify-content: center;
  }
}

.search-wrapper {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.result-wrapper {
  display: flex;
  gap: $spacing-size4;
  width: 100%;
  padding-top: $spacing-size5;

  .result-chart {
    flex-shrink: 0;
    width: 40%;
    height: 400px;
  }

  .result-table {
    flex: 1;
    width: 400px;
    height: 400px;

    .table-title {
      margin-bottom: $spacing-size2;
      font-size: $font-size-l;
    }
  }
}

.btn-group {
  display: flex;
  justify-content: center;
  width: 200px;
  height: fit-content;
}

.statistics {
  width: 100%;

  @include flex-center(row-between);

  margin-top: $spacing-size5;
  font-size: $font-size-m;

  .statistics-desc {
    display: flex;
    width: 50%;

    .total {
      width: 50%;
    }
  }
}

::v-deep(.el-input__inner) {
  text-align: left;
}
</style>
