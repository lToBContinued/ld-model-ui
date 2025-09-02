<template>
  <div class="assess-card">
    <zk-card style="margin-bottom: 14px">
      <template #header>
        <span class="card-header">基础信息</span>
      </template>
      <zk-form
        ref="baseFormDataRef"
        v-model="baseFormData"
        :form-config="baseFormConfig"
        inline
        label-width="100"
      ></zk-form>
    </zk-card>
    <zk-card style="margin-bottom: 14px">
      <div class="select-scheme-wrapper" v-loading="calculating">
        <zk-select
          ref="schemeSelectRef"
          v-model="scheme"
          :options="schemeListOptions"
          class="select-scheme"
          style="width: 300px"
          @change="changeSelectedScheme"
        ></zk-select>
        <el-empty v-if="tableState.totalData.length === 0" description="请选择评估方案"></el-empty>
        <div v-else class="input-table">
          <zk-table
            :columns="tableState.columns"
            :data="tableState.totalData"
            default-expand-all
            row-key="id"
            show-overflow-tooltip
          >
            <template #score="{ row }">
              <!--{{ row.formConfig? }}-->
              <zk-input-number
                v-if="row.formConfig?.type === 'numberInput'"
                v-model="row.score"
                :max="row.formConfig?.config.max"
                :min="row.formConfig?.config.min"
                :step="row.formConfig?.config.step"
                align="left"
                step-strictly
              ></zk-input-number>
              <zk-select
                v-if="row.formConfig?.type === 'select'"
                v-model="row.score"
                :options="row.formConfig?.config.options"
              ></zk-select>
            </template>
            <template #remark="{ row }">
              <zk-input v-if="row.formConfig" v-model="row.remark" :rows="1" type="textarea"></zk-input>
            </template>
          </zk-table>
          <zk-button
            class="submit-assess"
            type="primary"
            size="large"
            style="width: 100%; margin-top: 14px"
            @click="submitAssess"
          >
            提交评估
          </zk-button>
        </div>
      </div>
    </zk-card>
  </div>
</template>

<script setup lang="ts">
import ZkSelect from '@/components/zk/zk-select.vue'
import ZkForm from '@/components/zk/zk-form.vue'
import { ref, shallowRef, reactive } from 'vue'
import {
  BaseFormConfigItem,
  BaseFormData,
  GenerateSubmitFormData,
  IndicatorListItem,
  schemeListOptionsItem,
  TableState,
} from '@/views/runAssess/types.ts'
import { SchemeListItem } from '@/api/schemeManage/types.ts'
import { getSchemeListApi } from '@/api/schemeManage'
import {
  calculateAssessDataApi,
  getIndicatorConfigBySchemeApi,
  getRunAssessIdApi,
  getTrainCompanyApi,
  saveEnterAssessDataApi,
} from '@/api/runAccess'
import { GetIndicatorConfigBySchemeApiRes } from '@/api/runAccess/types.ts'
import { columns } from '@/views/runAssess/configs/tableConfigs.ts'
import { formConfig } from '@/views/runAssess/configs/formConfigs.ts'

defineOptions({
  name: 'runAssess',
})

const baseFormConfig = ref<BaseFormConfigItem[]>(formConfig)
const baseFormData = ref<BaseFormData>({
  departmentName: '',
  trainTime: null,
  assessTime: null,
  expert: '',
})
const scheme = ref<UndefinedType<number>>()
const schemeListOptions = ref<schemeListOptionsItem[]>([])
const baseFormDataRef = ref<InstanceType<typeof ZkForm>>()
const schemeSelectRef = shallowRef<InstanceType<typeof ZkSelect>>()
const tableState = reactive<TableState>({
  totalData: [],
  columns: columns,
})
const calculating = ref(false) // 计算中的加载遮罩

/**
 * @description 获取单位列表
 */
const getCompanyList = async () => {
  const res = await getTrainCompanyApi()
  baseFormConfig.value.find((item) => item.prop === 'departmentName')!.config!.options = res.data!.records.map(
    (item: any) => {
      return {
        label: item.departmentName,
        value: item.departmentId,
      }
    },
  )
}
/**
 * @description 获取方案列表选项
 */
const getSchemeListOptions = async () => {
  const params = {
    page: 1,
    size: 9999,
  }
  const res = await getSchemeListApi(params)
  schemeListOptions.value = res.data!.records.map((item: SchemeListItem) => {
    return {
      label: item.name,
      value: item.id,
    }
  })
}
/**
 * @description 方案改变时
 * @param {number} schemeId 方案id
 */
const changeSelectedScheme = async (schemeId: number) => {
  if (!schemeId) {
    tableState.totalData = []
    return
  }
  const res = await getIndicatorConfigBySchemeApi(schemeId)
  tableState.totalData = parseFormConfigDeep([res.data!])
}
/**
 * @description 解析formConfig
 * @param {GetIndicatorConfigBySchemeApiRes} data 原始指标列表
 */
const parseFormConfigDeep = (data: GetIndicatorConfigBySchemeApiRes[]): TableState['totalData'] => {
  return data.map((item) => {
    let formConfig = null
    try {
      formConfig = item.formConfig != null ? JSON.parse(item.formConfig) : null
    } catch {
      formConfig = null
    }
    return {
      ...item,
      formConfig,
      children: item.children ? parseFormConfigDeep(item.children) : undefined,
    } as IndicatorListItem
  })
}
/**
 * @description 提交评估
 */
const submitAssess = async () => {
  try {
    // 非空校验
    await baseFormDataRef.value?.ElFormRef?.validate()
    const scoreList = generateSubmitFormData()
    if (scoreList.some((item) => !item.value)) {
      ElMessage.warning('有表单项或评估项未填，请检查！')
      return
    }
    calculating.value = true
    const data = {
      baseInfo: baseFormData.value,
      enterData: scoreList,
    }
    const runId = await getRunAssessId() // 获取评估运行id
    await saveAssessData(runId, data) // 保存录入评估数据
    await calculateAssess(runId) // 计算
    ElMessage.success('评估提交并计算完成')
  } catch (e: any) {
    let msg
    if (e.message === 'SAVE_FAILED') {
      msg = '保存评估数据失败'
    } else if (e.message === 'CALC_FAILED') {
      msg = '计算失败'
    }
    ElMessage.error(msg)
    console.error(e)
  } finally {
    calculating.value = false
  }
}
/**
 * @description 保存评估录入数据
 */
const saveAssessData = async (runId: number, data: any) => {
  const body = {
    runId,
    ...data,
  }
  const res = await saveEnterAssessDataApi(body)
  if (res.status === 200) {
    ElMessage.success('保存评估数据成功')
    return res
  } else {
    throw new Error('SAVE_FAILED')
  }
}
/**
 * @description 计算
 * @param {number} runId 运行id
 */
const calculateAssess = async (runId: number) => {
  const res = await calculateAssessDataApi(runId)
  if (res.status === 200) {
    ElMessage.success('计算成功')
    return res
  } else {
    throw new Error('CALC_FAILED')
  }
}
/**
 * @description 获取评估运行id
 */
const getRunAssessId = async () => {
  const title = schemeSelectRef.value?.ElSelectRef?.selectedLabel as string
  const res = await getRunAssessIdApi({
    title,
    schemeId: scheme.value!,
  })
  return res.id
}
/**
 * @description 生成提交评估的表单结果
 */
const generateSubmitFormData: GenerateSubmitFormData = (data = tableState.totalData) => {
  return data.flatMap((item: IndicatorListItem) => {
    if (item.children && item.children.length > 0) {
      return generateSubmitFormData(item.children)
    }
    let sourceKey = ''
    if (item.formConfig) {
      if (item.formConfig.type === 'select') {
        sourceKey = item.formConfig.config?.options!.find((option) => option.value === item.score)?.label || ''
      } else if (item.formConfig.type === 'numberInput') {
        sourceKey = ''
      }
    }
    return {
      paramId: item.id,
      sourceKey: sourceKey,
      value: item.score,
      remark: item.remark,
    }
  })
}

getCompanyList()
getSchemeListOptions()
</script>

<style scoped lang="scss">
.card-header {
  font-size: $font-size-l;
}

.form-bths {
  @include flex-center(row-center);
}

.select-scheme-wrapper {
  width: 100%;

  .input-table {
    margin-top: $spacing-size2;
  }
}
</style>
