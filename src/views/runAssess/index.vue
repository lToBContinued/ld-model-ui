<template>
  <div class="assess-card">
    <zk-card style="margin-bottom: 14px">
      <template #header>
        <span class="card-header">基础信息</span>
      </template>
      <zk-form
        ref="baseFormDataRef"
        v-model:form-config="baseFormConfig"
        v-model:form-data="baseFormData"
        inline
        label-width="100"
      ></zk-form>
    </zk-card>
    <zk-card style="margin-bottom: 14px">
      <div class="select-scheme-wrapper">
        <zk-select class="select-scheme" v-model="scheme" :options="schemeList" style="width: 240px"></zk-select>
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
      </div>
    </zk-card>
  </div>
</template>

<script setup lang="ts">
import ZkForm from '@/components/zk/zk-form.vue'
import { ref, reactive } from 'vue'
import AssessList from '@/views/runAssess/components/assess-list.vue'
import { SchemeListItem } from '@/api/schemeManage/types.ts'
import { getRunAssessConfig } from '@/views/assessTargetSystem/runAssessConfig.ts'
import { getSchemeListApi } from '@/api/schemeManage'
import { BaseFormConfigItem, BaseFormData, IndicatorListItem } from '@/views/runAssess/types.ts'

// 参训单位列表
const companyList = ref<Record<string, any>>([])
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
const baseFormData = reactive<BaseFormData>({
  company: '',
  trainingTime: null,
  assessTime: null,
  expert: '',
})
const scheme = ref<UndefinedType<number>>()
const schemeList = ref<SchemeListItem[]>([])
const indicatorList = ref<IndicatorListItem[]>([])
const baseFormDataRef = ref<InstanceType<typeof ZkForm>>()

// 获取单位列表
const getCompanyList = () => {
  companyList.value = [
    {
      label: '单位1',
      value: '001',
    },
    {
      label: '单位2',
      value: '002',
    },
  ]
  baseFormConfig.value.find((item) => item.prop === 'company')!.config!.options = companyList.value
}
// 获取页面配置
const getPageConfig = async () => {
  const res = await getRunAssessConfig()
  indicatorList.value = res.data as IndicatorListItem[]
}
// 获取方案列表
const getSchemeList = async () => {
  const res = await getSchemeListApi()
  schemeList.value = res.data!.map((item) => {
    return {
      label: item.schemeName,
      value: item.id,
    }
  }) as SchemeListItem[]
}
// 提交评估
const submitAssess = async () => {
  baseFormDataRef.value?.ElFormRef?.validate()
    .then(() => {
      const scoreList = pickIdAndValue(indicatorList.value)
      const data = {
        baseInfo: baseFormData,
        scoreList,
      }
      console.log('>>>>> file: index.vue ~ method: submitAssess <<<<<\n', data) // TODO: 删除
    })
    .catch((e) => {
      ElMessage.error('有表单项未填，请检查！')
      console.error(e)
    })
}
/**
 * @description 获取树的indicatorId和value，并以数组形式返回
 * @param {IndicatorListItem[]} tree
 */
const pickIdAndValue = (
  tree: IndicatorListItem[],
): {
  indicatorId: number
  value: NullType<number | string>
}[] => {
  const result: { indicatorId: number; value: NullType<number | string> }[] = []
  const pick = (nodes: IndicatorListItem[]) => {
    nodes.forEach((node) => {
      const nodeInfo = {
        indicatorId: node.indicatorId,
        value: node.formConfig.value,
      }
      result.push(nodeInfo)
      if (node.children && node.children.length > 0) {
        pick(node.children)
      }
    })
  }
  pick(tree)
  return result
}

getCompanyList()
getPageConfig()
getSchemeList()
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
