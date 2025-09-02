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
      <div class="select-scheme-wrapper">
        <zk-select
          ref="schemeSelectRef"
          v-model="scheme"
          :options="schemeListOptions"
          class="select-scheme"
          style="width: 240px"
          @clear="resetSchemeSelect"
        ></zk-select>
        <el-empty v-if="indicatorList.length === 0" description="请选择方案"></el-empty>
        <template v-else>
          <div class="assess-list-wrapper">
            <assess-list v-model="indicatorList"></assess-list>
          </div>
          <zk-button
            class="submit-assess"
            type="primary"
            size="large"
            style="width: 100%; margin-top: 14px"
            @click="submitAssess"
          >
            提交评估
          </zk-button>
        </template>
      </div>
    </zk-card>
  </div>
</template>

<script setup lang="ts">
import ZkSelect from '@/components/zk/zk-select.vue'

defineOptions({
  name: 'runAssess',
})
import ZkForm from '@/components/zk/zk-form.vue'
import { ref, shallowRef, watchEffect } from 'vue'
import AssessList from '@/views/runAssess/components/assess-list.vue'
import { BaseFormConfigItem, BaseFormData, IndicatorListItem, schemeListOptionsItem } from '@/views/runAssess/types.ts'
import { SchemeListItem } from '@/api/schemeManage/types.ts'
import { getSchemeListApi } from '@/api/schemeManage'
import { getIndicatorConfigBySchemeApi, getRunAssessIdApi, getTrainCompanyApi } from '@/api/runAccess'
import { GetIndicatorConfigBySchemeApiRes } from '@/api/runAccess/types.ts'

// 参训单位列表
const baseFormConfig = ref<BaseFormConfigItem[]>([
  {
    prop: 'company',
    label: '参训单位',
    type: 'select',
    rules: [{ required: true, message: '此项不能为空', trigger: 'blur' }],
    config: {
      options: [],
    },
  },
  {
    prop: 'trainingTime',
    label: '参训时间',
    type: 'datePicker',
    rules: [{ required: true, message: '此项不能为空', trigger: 'blur' }],
    config: {
      type: 'date',
      format: 'YYYY-MM-DD',
    },
  },
  {
    prop: 'assessTime',
    label: '评估时间',
    type: 'datePicker',
    rules: [{ required: true, message: '此项不能为空', trigger: 'blur' }],
    config: {
      type: 'date',
      format: 'YYYY-MM-DD',
    },
  },
  {
    prop: 'expert',
    label: '专家',
    type: 'input',
    rules: [{ required: true, message: '此项不能为空', trigger: 'blur' }],
  },
])
const baseFormData = ref<BaseFormData>({
  company: '',
  trainingTime: null,
  assessTime: null,
  expert: '',
})
const scheme = ref<UndefinedType<number>>()
const schemeListOptions = ref<schemeListOptionsItem[]>([])
const indicatorList = ref<IndicatorListItem[]>([])
const baseFormDataRef = ref<InstanceType<typeof ZkForm>>()
const schemeSelectRef = shallowRef<InstanceType<typeof ZkSelect>>()

/**
 * @description 方案改变时，获取指标列表
 */
watchEffect(async () => {
  if (scheme.value) {
    const res = await getIndicatorConfigBySchemeApi(scheme.value)
    indicatorList.value = parseFormConfigDeep(res.data!.children)
  }
})

/**
 * @description 获取单位列表
 */
const getCompanyList = async () => {
  const res = await getTrainCompanyApi()
  baseFormConfig.value.find((item) => item.prop === 'company')!.config!.options = res.data!.records.map((item: any) => {
    return {
      label: item.departmentName,
      value: item.departmentId,
    }
  })
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
 * @description 清除方案选择框
 */
const resetSchemeSelect = () => {
  indicatorList.value = []
}
/**
 * @description 解析formConfig
 * @param {GetIndicatorConfigBySchemeApiRes[]} data 原始指标列表
 */
const parseFormConfigDeep = (data: GetIndicatorConfigBySchemeApiRes[]): IndicatorListItem[] => {
  return data.map((item) => ({
    ...item,
    formConfig: item.formConfig ? JSON.parse(item.formConfig) : null,
    children: item.children ? parseFormConfigDeep(item.children) : [],
  })) as IndicatorListItem[]
}
/**
 * @description 提交评估
 */
const submitAssess = async () => {
  try {
    // await baseFormDataRef.value?.ElFormRef?.validate()
    // console.log('>>>>> file: index.vue ~ method: submitAssess <<<<<\n', indicatorList.value) // TODO: 删除
    // const runId = await getRunAssessId()
    const scoreList = pickIdAndValue(indicatorList.value)
    const data = {
      baseInfo: baseFormData.value,
      scoreList,
    }
    console.log('>>>>> file: index.vue ~ method: submitAssess <<<<<\n', data) // TODO: 删除
  } catch (e) {
    ElMessage.error('有表单项或评估项未填，请检查！')
    console.error(e)
  }
}
/**
 * @description 获取树的indicatorId和value，并以数组形式返回
 * @param {IndicatorListItem[]} tree
 */
const pickIdAndValue = (
  tree: IndicatorListItem[],
): {
  nodeId: number
  score: NullType<number | string>
}[] => {
  const result: {
    nodeId: number
    score: NullType<number | string>
  }[] = []
  const pick = (nodes: IndicatorListItem[]) => {
    nodes.forEach((node) => {
      if (node.formConfig !== null) {
        const nodeInfo = {
          nodeId: node.id,
          score: node.formConfig.value,
        }
        result.push(nodeInfo)
      }
      if (node.children && node.children.length > 0) {
        pick(node.children)
      }
    })
  }
  pick(tree)
  return result
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

  .assess-list-wrapper {
    margin-top: $spacing-size2;
    border: 1px solid $border-color2;
  }
}
</style>
