<template>
  <div class="indicatorManage">
    <zk-card>
      <el-row>
        <el-col :span="10">
          <aside-tree
            v-if="asideTreeShow"
            ref="asideTreeRef"
            @view-node="viewNode"
            @remove-node="removeNode"
          ></aside-tree>
        </el-col>
        <el-col :span="14">
          <div class="panel">
            <el-form :model="indicatorConfigFormData" label-width="80px">
              <el-form-item label="父级指标" prop="parentName">
                <zk-input v-model="indicatorConfigFormData.parentName" disabled></zk-input>
              </el-form-item>
              <el-form-item label="指标名称" prop="name">
                <zk-input v-model="indicatorConfigFormData.name"></zk-input>
              </el-form-item>
              <el-form-item label="指标描述" prop="description">
                <zk-input v-model="indicatorConfigFormData.description" type="textarea" style="width: 100%"></zk-input>
              </el-form-item>
              <el-form-item label="节点类型" prop="isLeaf">
                <zk-radio
                  v-model="indicatorConfigFormData.isLeaf"
                  :options="[
                    { label: '计算节点', value: 0 },
                    { label: '录入节点', value: 1 },
                  ]"
                  disabled
                ></zk-radio>
              </el-form-item>
              <el-form-item label="指标配置" prop="config">
                <form-configurator v-model="indicatorConfigFormData.config"></form-configurator>
              </el-form-item>
            </el-form>
            <zk-button style="margin-right: auto" type="primary" @click="saveConfig">保存配置</zk-button>
          </div>
        </el-col>
      </el-row>
    </zk-card>
  </div>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref, watch } from 'vue'
import ZkForm from '@/components/zk/zk-form.vue'
import AsideTree from '@/views/assessTargetSystem/indicatorManage/components/aside-tree.vue'
import { getIndicatorDetailApi, updateIndicatorDetailApi } from '@/api/indicatorManage'
import { RenderContentContext } from 'element-plus'
import { IndicatorConfigFormData } from '@/views/assessTargetSystem/types.ts'
import { GetIndicatorDetailRes, UpdateIndicatorDetailSend } from '@/api/indicatorManage/types.ts'

type Node = RenderContentContext['node']
type Data = RenderContentContext['data']

const indicatorConfigFormRef = ref<InstanceType<typeof ZkForm>>()
const asideTreeRef = ref<InstanceType<typeof AsideTree>>()
const indicatorConfigFormData = reactive<IndicatorConfigFormData>({
  config: '{"prop":"0","type":"numberInput","value":null,"config":{"min":6,"max":10,"step":1}}',
  description: '',
  name: '',
  isLeaf: 0,
  parentName: '',
})
const asideTreeShow = ref(true)

/*watch(
  () => indicatorConfigFormData.isLeaf,
  (newVal) => {
    const configItem = indicatorConfigFormConfig.value.find((item) => item.prop === 'config')
    if (configItem) {
      configItem.config.readonly = newVal === 0
    }
  },
  { immediate: true },
)*/

const viewNode = async (data: Data, _: Node) => {
  const res = await getIndicatorDetail(data.id)
  const { config, id, description, name, parentName, isLeaf, parentId, systemId } = res
  Object.assign(indicatorConfigFormData, {
    config,
    id,
    description,
    name,
    parentName,
    isLeaf,
    parentId,
    systemId,
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
  if (indicatorConfigFormData.parentId === 0) {
    asideTreeShow.value = false
    await nextTick()
    asideTreeShow.value = true
  }
  asideTreeRef.value?.refreshAllTree()
}
const removeNode = () => {
  Object.assign(indicatorConfigFormData, {
    config: '',
    description: '',
    name: '',
    isLeaf: 0,
    parentName: '',
  })
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
