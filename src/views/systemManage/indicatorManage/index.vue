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
            <zk-button style="margin-left: auto" type="primary" @click="saveConfig">保存配置 </zk-button>
          </div>
        </el-col>
      </el-row>
    </zk-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { indicatorConfigFormConfig } from '@/views/systemManage/indicatorManage/configs/formConfigs.ts'
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

const viewNode = async (data: Data, _: Node) => {
  const res = await getIndicatorDetail(data.id)
  const { config, id, indicatorDesc, indicatorName, parentName } = res
  Object.assign(indicatorConfigFormData, {
    config,
    id,
    indicatorDesc,
    indicatorName,
    parentName,
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
