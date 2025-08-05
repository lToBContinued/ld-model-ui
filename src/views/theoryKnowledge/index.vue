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
          ref="ZkFormRef"
          :form-config="theoryKnowledgeAssessFormConfig"
          :form-data="assessFormData"
          :rules="rules"
          label-width="140"
          inline
        ></zk-form>
        <div class="btn-group">
          <zk-button @click="reset">重置</zk-button>
          <zk-button type="primary" @click="submitForm">确定</zk-button>
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
          ref="ZkFormRef"
          :form-config="theoryKnowledgeSearchFormConfig"
          :form-data="searchFormData"
          :rules="rules"
          label-width="140"
          inline
        ></zk-form>
        <div class="btn-group">
          <zk-button @click="reset">重置</zk-button>
          <zk-button type="primary" @click="submitForm">确定</zk-button>
        </div>
      </div>
      <!--结果表格-->
      <div class="result-wrapper">
        <div class="result-chart" ref="resultChart"></div>
        <div class="result-table">
          <p class="table-title bold">评估详情</p>
          <zk-table
            ref="multipleTable"
            v-model:current-page="state.currentPage"
            v-model:page-size="state.pageSize"
            :columns="resultTableColumns"
            :data="tableData"
            :total="state.total"
            max-height="200"
            @select="handleSelectChange"
            @select-all="handleSelectAllChange"
            @update:page-size="handleSizeChange"
            @update:current-page="currentChange"
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
            <div class="export-btns">
              <zk-button type="success">导出Excel</zk-button>
              <zk-button type="primary">导出PDF</zk-button>
            </div>
          </div>
        </div>
      </div>
    </zk-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, nextTick, watch, reactive } from 'vue'
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
const ZkFormRef = ref<InstanceType<typeof ZkForm>>()
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
const rules: FormRules = {
  company: [{ required: true, message: '请输入评估单位', trigger: 'blur' }],
  companyNumber: [{ required: true, message: '请输入单位编号', trigger: 'blur' }],
}

const state = reactive({
  currentPage: 1,
  selectRowMap: new Map(), //用于存储选中的每一行
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

const multipleTable = ref<InstanceType<typeof ZkTable>>()

const tableData = computed(() => {
  return state.totalData.slice((state.currentPage - 1) * state.pageSize, state.currentPage * state.pageSize)
})

onMounted(() => {
  renderChart(theoryKnowledgeResultChartOptions)
})

watch(
  () => state.selectRowMap,
  (newVal) => {
    console.log('>>>>> file: index.vue ~ method:  <<<<<\n', newVal) // TODO: 删除
  },
  {
    deep: true,
  },
)

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
const submitForm = async () => {
  try {
    await ZkFormRef.value?.formRef?.validate()
    console.log('>>>>> file: index.vue ~ method: submitForm <<<<<\n', assessFormData.value) // TODO: 删除
  } catch (e) {
    console.log(e)
  }
}
const reset = () => {
  ZkFormRef.value?.formRef?.resetFields()
}
// 选择单条数据
const handleSelectChange = (val: any, row: any) => {
  const checked = state.selectRowMap.has(row.id)
  if (checked) {
    state.selectRowMap.delete(row.id)
  } else {
    state.selectRowMap.set(row.id, row)
  }
}
// 全选
const handleSelectAllChange = (val: any) => {
  tableData.value.forEach((row) => {
    if (val.length === 0) {
      // 取消全选 只有选中的需要改变状态
      if (isChecked(row)) onRowSelectChange(row)
    } else {
      // 全选 只有未选中的才需要改变状态
      if (!isChecked(row)) onRowSelectChange(row)
    }
  })
}
// 页面切换
const currentChange = (page: any) => {
  state.currentPage = page
  tableData.value.forEach((row: any) => {
    nextTick(() => {
      const checked = state.selectRowMap.has(row.id)
      if (checked) {
        multipleTable.value?.ElTableRef?.toggleRowSelection(row, true)
      }
    })
  })
}
// 修改每页显示条数
const handleSizeChange = (val: number) => {
  state.pageSize = val
  currentChange(1)
}

const isChecked = (row: any) => {
  return state.selectRowMap.has(row.id)
}

const onRowSelectChange = (row: any) => {
  if (state.selectRowMap.has(row.id)) {
    state.selectRowMap.delete(row.id)
    multipleTable.value?.ElTableRef?.toggleRowSelection(row, false)
  } else {
    state.selectRowMap.set(row.id, row)
    multipleTable.value?.ElTableRef?.toggleRowSelection(row, true)
  }
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
