<template>
  <div class="indicatorManage">
    <zk-card>
      <el-row>
        <el-col :span="10">
          <aside-tree ref="asideTreeRef" @view-node="viewNode"></aside-tree>
        </el-col>
        <el-col :span="14">
          <div class="panel">
            <zk-form
              ref="indicatorConfigFormRef"
              v-model:form-data="indicatorConfigFormData"
              v-model:form-config="indicatorConfigFormConfig"
              label-width="80"
            ></zk-form>
            <form-configurator v-model="indicatorInputJson" :indicator-id="56"></form-configurator>
            <zk-button style="margin-left: auto" type="primary" @click="saveConfig">保存配置 </zk-button>
          </div>
        </el-col>
      </el-row>
    </zk-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import ZkForm from '@/components/zk-form.vue'
import AsideTree from '@/views/systemManage/indicatorManage/components/aside-tree.vue'
import { getIndicatorDetailApi, updateIndicatorDetailApi } from '@/api/indicatorManage'
import { RenderContentContext } from 'element-plus'
import { IndicatorConfigFormData } from '@/views/systemManage/types.ts'
import { GetIndicatorDetailRes, UpdateIndicatorDetailSend } from '@/api/indicatorManage/types.ts'

type Node = RenderContentContext['node']
type Data = RenderContentContext['data']

const indicatorConfigFormRef = ref<InstanceType<typeof ZkForm>>()
const asideTreeRef = ref<InstanceType<typeof AsideTree>>()
const indicatorConfigFormData = reactive<IndicatorConfigFormData>({
  config: '',
  indicatorDesc: '',
  indicatorName: '',
  isLeaf: 0,
  parentName: '',
})
const indicatorConfigFormConfig = ref([
  {
    prop: 'parentName',
    label: '父级指标',
    type: 'input',
    config: {
      disabled: true,
      style: {
        width: '240px',
      },
    },
  },
  {
    prop: 'indicatorName',
    label: '指标名称',
    type: 'input',
    rules: [{ required: true, message: '请输入指标名称', trigger: ['blur'] }],
    config: {
      style: {
        width: '240px',
      },
    },
  },
  {
    prop: 'indicatorDesc',
    label: '指标描述',
    type: 'input',
    config: {
      type: 'textarea',
    },
  },
  {
    prop: 'isLeaf',
    label: '节点类型',
    type: 'radio',
    config: {
      options: [
        { label: '计算节点', value: 0 },
        { label: '录入节点', value: 1 },
      ],
    },
  },
  {
    prop: 'config',
    label: '指标配置',
    type: 'jsonEditor',
    config: {
      readonly: true,
    },
  },
])
const indicatorInputJson = ref(
  `
    {
      "prop": "56",
      "type": "numberInput",
      "config": {
        "min": 0,
        "max": 100,
        "step": 1
      }
    }
  `,
)

watch(indicatorInputJson, (newVal) => {
  console.log('>>>>> file: index.vue ~ method: indicatorInputJson <<<<<\n', indicatorInputJson.value) // TODO: 删除
})

watch(
  () => indicatorConfigFormData.isLeaf,
  (newVal) => {
    const configItem = indicatorConfigFormConfig.value.find((item) => item.prop === 'config')
    if (configItem) {
      configItem.config.readonly = newVal === 0
    }
  },
  { immediate: true },
)

const viewNode = async (data: Data, _: Node) => {
  const res = await getIndicatorDetail(data.id)
  const { config, id, indicatorDesc, indicatorName, parentName, isLeaf } = res
  Object.assign(indicatorConfigFormData, {
    config,
    id,
    indicatorDesc,
    indicatorName,
    parentName,
    isLeaf,
  })
}
const getIndicatorDetail = async (id: number): Promise<GetIndicatorDetailRes> => {
  const res = await getIndicatorDetailApi({ id })
  return res.data!
}
const saveConfig = async () => {
  await indicatorConfigFormRef.value?.ElFormRef?.validate()
  await updateIndicatorDetailApi(indicatorConfigFormData as UpdateIndicatorDetailSend)
  await getIndicatorDetail(indicatorConfigFormData.id!)
  asideTreeRef.value?.refreshTree()
}
</script>

<style scoped lang="scss">
.panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-left: $spacing-size2;
}

::v-deep(.el-card__body) {
  height: calc(100vh - 50px - 2 * $spacing-size5);
}

::v-deep(.el-tree-node__content) {
  height: 40px;
}
</style>
