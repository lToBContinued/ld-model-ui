<template>
  <div class="indicatorManage">
    <zk-card>
      <el-row>
        <el-col :span="10">
          <div class="tree">
            <zk-button type="primary" @click="addRoot" :icon="Plus" style="margin: 4px 0 0 4px">
              添加指标体系
            </zk-button>
            <zk-tree
              ref="ZkTreeRef"
              v-model:data="rootTree"
              :active="{ append: true, edit: false, remove: true, check: false }"
              :load="getTreeConfig"
              lazy
              @node-click="viewNode"
            ></zk-tree>
          </div>
        </el-col>
        <el-col :span="14">
          <div class="panel">
            <zk-form
              v-model:form-data="indicatorConfigFormData"
              v-model:form-config="indicatorConfigFormCofnig"
              label-width="80"
            ></zk-form>
            <zk-button type="primary" @click="saveConfig" style="margin-left: auto">保存配置 </zk-button>
          </div>
        </el-col>
      </el-row>
    </zk-card>
    <zk-dialog
      v-model="addRootDialogShow"
      width="450px"
      @close="closeRootDialog"
      @cancel="closeRootDialog"
      @confirm="submitAddRootDialog"
    >
      <template #header>
        <span style="font-size: 18px">添加指标体系</span>
      </template>
      <div style="width: 400px">
        <zk-form
          ref="addRootFormRef"
          v-model:form-config="addRootFormConfig"
          v-model:form-data="addRootFormData"
          :rules="addRootFormRules"
          label-width="80"
        ></zk-form>
      </div>
    </zk-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, ref } from 'vue'
import { RenderContentContext } from 'element-plus'
import indicatorTemplate from './indicatorTemplate.json'
import type { LoadFunction } from 'element-plus'
import { getIndicatorDetail, getIndicatorTree } from '@/api/indicatorManage'
import ZkTree from '@/components/zk-tree.vue'
import { Plus } from '@element-plus/icons-vue'
import {
  addRootFormConfig,
  indicatorConfigFormCofnig,
} from '@/views/systemManage/indicatorManage/configs/formConfigs.ts'
import ZkForm from '@/components/zk-form.vue'

type Node = RenderContentContext['node']
type Data = RenderContentContext['data']

const ZkTreeRef = ref<InstanceType<typeof ZkTree>>()
const addRootFormRef = ref<InstanceType<typeof ZkForm>>()
const addRootDialogShow = ref(false)
const rootTree = reactive([
  {
    id: '0',
    label: 'ld指标根节点',
  },
])
const indicatorConfigFormData = reactive({
  parent: '',
  indicatorName: '',
  description: '',
  type: '',
  config: JSON.stringify(indicatorTemplate, null, 2),
})
const addRootFormData = reactive({
  indicatorName: '',
  description: '',
})
const addRootFormRules = {
  indicatorName: [{ required: true, message: '请输入指标名称', trigger: 'blur' }],
}

watch(
  () => rootTree,
  (newVal) => {
    console.log('>>>>> file: index.vue ~ method:  <<<<<\n', newVal) // TODO: 删除
  },
  { deep: true },
)

// 获取树
const getTreeConfig: LoadFunction = async (node, resolve, reject) => {
  if (node.level === 0) {
    return resolve(rootTree)
  }
  if (node.level >= 1) {
    const res = await getIndicatorTree({ nodeId: node.data.id })
    if (res.status === 200) {
      return resolve(res.data)
    } else {
      ElMessage.error('节点加载失败，请重试')
      return reject()
    }
  }
}
// 查看节点
const viewNode = async (data: Data, node: Node) => {
  const self = data
  const parent = node.parent?.data
  const res = await getIndicatorDetail({ nodeId: self.id })
  const { indicatorName, description, type, config, formConfig } = res.data
  indicatorConfigFormData.parent = parent?.label
  indicatorConfigFormData.indicatorName = indicatorName
  indicatorConfigFormData.description = description
  indicatorConfigFormData.type = type
  indicatorConfigFormData.config = config
  indicatorConfigFormData.config = formConfig
}
// 保存配置
const saveConfig = () => {
  console.log('>>>>> file: index.vue ~ method: submit <<<<<\n', indicatorConfigFormData) // TODO: 删除
}
// 打开添加根节点弹窗
const addRoot = () => {
  addRootDialogShow.value = true
}
const closeRootDialog = () => {
  addRootFormRef.value?.ElFormRef?.resetFields()
  addRootDialogShow.value = false
}
// 添加指标体系根节点
const submitAddRootDialog = async () => {
  try {
    await addRootFormRef.value?.ElFormRef?.validate()
    const rootNode = {
      id: `${Date.now()}`,
      label: addRootFormData.indicatorName,
    }
    rootTree.push(rootNode)
    // TODO: 提交添加指标体系根节点
    closeRootDialog()
  } catch (e) {
    console.error(e)
  }
}
</script>

<style scoped lang="scss">
.tree {
  overflow-y: auto;
  width: 100%;
  height: 600px;
  border: 1px solid $border-color1;
}

.panel {
  display: flex;
  flex-direction: column;
  width: 100%;
}

::v-deep(.el-card__body) {
  height: calc(100vh - 50px - 2 * $spacing-size5);
}

::v-deep(.el-tree-node__content) {
  height: 40px;
}
</style>
