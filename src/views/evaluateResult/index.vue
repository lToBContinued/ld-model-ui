<template>
  <div class="evaluateResult">
    <zk-card class="module-bottom">
      <div class="search-wrapper">
        <zk-form
          ref="ZkFormRef"
          v-model="formData"
          :form-config="formConfig"
          class="search-form"
          inline
          label-width="120"
        ></zk-form>
        <div class="btn-group">
          <zk-button @click="reset">重置</zk-button>
          <zk-button type="primary" @click="submitForm">确定</zk-button>
        </div>
      </div>
    </zk-card>
    <!--<zk-card class="module-bottom">
      <template #header>
        <span class="card-title">评估分布</span>
      </template>
      <div class="chart" ref="resultChartInstance"></div>
    </zk-card>-->
    <zk-card class="module-bottom">
      <div class="result-wrapper">
        <zk-table
          v-model:current-page="assessResultTableState.currentPage"
          v-model:page-size="assessResultTableState.pageSize"
          :columns="assessResultTableState.columns"
          :data="assessResultTableState.totalData"
          :total="assessResultTableState.total"
          max-height="400"
          @update:current-page="handelCurrentPageChange"
          @update:page-size="handelPageSizeChange"
        >
          <template #level="{ row }">
            <zk-tag :type="formatLevel(row.level)?.type">{{ formatLevel(row.level)?.label }} </zk-tag>
          </template>
          <template #operation="{ row }">
            <div class="btn-group">
              <zk-button type="primary" size="small" @click="checkDetail(row.id)">查看</zk-button>
              <!--<zk-button type="success" size="small">导出</zk-button>-->
            </div>
          </template>
        </zk-table>
        <zk-dialog
          v-model="detailDialogShow"
          :show-footer="false"
          close-on-click-modal
          title="评估详情"
          top="10vh"
          width="80%"
        >
          <el-descriptions class="margin-top" :column="3" border>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">执行方案名称</div>
              </template>
              <span>{{ selectedIndicatorSysDetail!['schemeName'] }}</span>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">体系名称</div>
              </template>
              <span>{{ selectedIndicatorSysDetail!['indicatorSystemName'] }}</span>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">评估专家</div>
              </template>
              <span>{{ selectedIndicatorSysDetail!['experts'] }}</span>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">总分</div>
              </template>
              <span>{{ selectedIndicatorSysDetail!['totalScore'] }}</span>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">评估时间</div>
              </template>
              <span>{{ selectedIndicatorSysDetail!['assessTime'] }}</span>
            </el-descriptions-item>
          </el-descriptions>
          <zk-table
            :columns="recordDetailTableState.columns"
            :data="recordDetailTableState.totalData"
            max-height="500"
            row-key="id"
          ></zk-table>
        </zk-dialog>
      </div>
    </zk-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, shallowRef } from 'vue'
import { evaluateResultFormConfig } from '@/views/evaluateResult/configs/formConfig.ts'
import {
  AssessResultTableState,
  EvaluateResultFormType,
  RecordDetailTableState,
  SelectedIndicatorSysDetail,
} from '@/views/evaluateResult/type.ts'
import { evaluateResultTableConfig, recordDetailTableColumn } from '@/views/evaluateResult/configs/tableConfigs.ts'
import { useEcharts } from '@/hooks/useEcharts.ts'
import { resultChartOption } from '@/views/evaluateResult/configs/chartsOption.ts'
import { getTraineesListApi } from '@/api/global'
import ZkForm from '@/components/zk/zk-form.vue'
import { CascaderNode, Resolve } from 'element-plus'
import {
  getAssessResultListApi,
  getIndicatorSystemApi,
  getRecordDetailApi,
  getSchemeByIndicatorSysApi,
} from '@/api/evaluateResult'
import { formatDate } from '@/utils/common/formatData.ts'

const resultChartInstance = ref<NullType<HTMLDivElement>>(null)
const { renderChart } = useEcharts(resultChartInstance, { themeMode: 'dark' })
const ZkFormRef = shallowRef<InstanceType<typeof ZkForm>>()
const formConfig = ref(evaluateResultFormConfig)
const detailDialogShow = ref(false)
const formData = ref<EvaluateResultFormType>({
  department: undefined,
  startDate: undefined,
  endDate: undefined,
  subject: [undefined, undefined],
})
const assessResultTableState = reactive<AssessResultTableState>({
  totalData: [],
  pageSize: 10,
  currentPage: 1,
  total: 0,
  columns: evaluateResultTableConfig,
})
const recordDetailTableState = reactive<RecordDetailTableState>({
  totalData: [],
  columns: recordDetailTableColumn,
})
const selectedIndicatorSysDetail = ref<SelectedIndicatorSysDetail>({
  schemeName: '',
  indicatorSystemName: '',
  experts: '',
  totalScore: '',
  assessTime: '',
})

onMounted(() => {
  renderChart(resultChartOption)
  formConfig.value.find((item: any) => item.prop === 'subject').config.props.lazyLoad = lazyLoadSubjectOptions
})

/**
 * @description 获取参训单位下拉框选项列表
 */
const getTraineesList = async () => {
  const res = await getTraineesListApi({
    pageNum: 1,
    pageSize: 99999,
  })
  formConfig.value.find((item: any) => item.prop === 'department')!.config.options = res.data!.records.map((item) => {
    return {
      label: item.departmentName,
      value: item.departmentId,
    }
  })
}
/**
 * @description 评估科目选择的级联选择的懒加载方法
 * @param {CascaderNode} node 级联选择器的节点
 * @param {Resolve} resolve 添加节点的方法
 */
const lazyLoadSubjectOptions = async (node: CascaderNode, resolve: Resolve) => {
  if (node.level > 1) return resolve()
  if (node.level === 0) {
    // 请求指标体系列表
    const res = await getIndicatorSystemApi()
    resolve(res.data)
  } else {
    // 请求对应体系下的方案列表
    const res = await getSchemeByIndicatorSysApi(node.data.id as number)
    resolve(res.data)
  }
}
/**
 * @description 提交搜索
 */
const submitForm = async () => {
  await getAssessResultList()
}
/**
 * @description 重置
 */
const reset = async () => {
  ZkFormRef.value?.ElFormRef?.resetFields()
  await getAssessResultList()
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
/**
 * @description 获取评估结果列表
 */
const getAssessResultList = async () => {
  const data = {
    departmentName: formData.value.department,
    endDate: formData.value.endDate,
    indicatorSystemId: formData.value.subject ? formData.value.subject[0] : undefined,
    pageNum: assessResultTableState.currentPage,
    pageSize: assessResultTableState.pageSize,
    startDate: formData.value.startDate,
    subtreeId: formData.value.subject ? formData.value.subject[1] : undefined,
  }
  const res = await getAssessResultListApi(data)
  assessResultTableState.totalData = res.data!.records
  assessResultTableState.total = res.data!.total
}
const handelCurrentPageChange = (pageNum: number) => {
  assessResultTableState.currentPage = pageNum
  getAssessResultList()
}
const handelPageSizeChange = (pageSize: number) => {
  assessResultTableState.pageSize = pageSize
  getAssessResultList()
}
/**
 * @description 查看详情
 * @param {number} runId 运行id
 */
const checkDetail = async (runId: number) => {
  detailDialogShow.value = true
  const res = await getRecordDetailApi(runId)
  recordDetailTableState.totalData = res.data!.children
  selectedIndicatorSysDetail.value!['indicatorSystemName'] = res.data?.indicatorSystemName
  selectedIndicatorSysDetail.value!['schemeName'] = res.data?.subtreeName
  selectedIndicatorSysDetail.value!['experts'] = res.data?.experts
  selectedIndicatorSysDetail.value!['totalScore'] = res.data?.totalScore?.toFixed(2) || ''
  selectedIndicatorSysDetail.value!['assessTime'] = formatDate(res.data?.assessTime as string)
}

getTraineesList()
getAssessResultList()
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
.el-descriptions {
  margin-bottom: $spacing-size4;
}
.cell-item {
  display: flex;
  align-items: center;
}
</style>
