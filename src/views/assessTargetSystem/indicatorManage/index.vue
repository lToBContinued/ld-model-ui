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
          <div class="panel" v-if="indicatorConfigFormData.id">
            <el-form :model="indicatorConfigFormData" label-width="80px" :rules="indicatorConfigFormRules">
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
                <form-configurator
                  ref="formConfiguratorRef"
                  v-model="indicatorConfigFormData.config"
                  :indicator-id="currentIndicatorId"
                ></form-configurator>
              </el-form-item>
            </el-form>
            <zk-button style="margin-right: auto" type="primary" @click="saveConfig">保存配置 </zk-button>
          </div>
        </el-col>
      </el-row>
    </zk-card>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import ZkForm from '@/components/zk/zk-form.vue'
import AsideTree from '@/views/assessTargetSystem/indicatorManage/components/aside-tree.vue'
import { getIndicatorDetailApi, updateIndicatorDetailApi } from '@/api/indicatorManage'
import { RenderContentContext } from 'element-plus'
import { IndicatorConfigFormData } from '@/views/assessTargetSystem/types.ts'
import { GetIndicatorDetailRes, UpdateIndicatorDetailSend } from '@/api/indicatorManage/types.ts'
import FormConfigurator from '@/components/formConfigurator/index.vue'

type Node = RenderContentContext['node']
type Data = RenderContentContext['data']

const formConfiguratorRef = shallowRef<InstanceType<typeof FormConfigurator>>()
const indicatorConfigFormRef = ref<InstanceType<typeof ZkForm>>()
const asideTreeRef = ref<InstanceType<typeof AsideTree>>()
const indicatorConfigFormData = ref<IndicatorConfigFormData>({
  config: '',
  description: '',
  name: '',
  isLeaf: 0,
  parentName: '',
})
const asideTreeShow = ref(true)
const indicatorConfigFormRules = {
  name: [{ required: true, message: '请输入指标名称', trigger: 'blur' }],
}
const currentIndicatorId = ref()

const viewNode = async (data: Data, _: Node) => {
  const res = await getIndicatorDetail(data.id)
  const { config, id, description, name, parentName, isLeaf, parentId } = res
  currentIndicatorId.value = id
  Object.assign(indicatorConfigFormData.value, {
    config,
    id,
    description,
    name,
    parentName,
    isLeaf,
    parentId,
  })
}
const getIndicatorDetail = async (id: number): Promise<GetIndicatorDetailRes> => {
  const res = await getIndicatorDetailApi({ id })
  return res.data!
}
const saveConfig = async () => {
  try {
    await indicatorConfigFormRef.value?.ElFormRef?.validate()
    await updateIndicatorDetailApi(indicatorConfigFormData.value as UpdateIndicatorDetailSend)
    await getIndicatorDetail(indicatorConfigFormData.value.id!)
    asideTreeRef.value?.refreshAllTree()
  } catch (e: any) {
    console.error(e)
  }
}
const removeNode = () => {
  Object.assign(indicatorConfigFormData.value, {
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
