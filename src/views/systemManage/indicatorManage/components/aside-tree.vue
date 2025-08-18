<template>
  <div class="tree">
    <zk-button type="primary" @click="addRoot" :icon="Plus" style="margin: 4px 0 0 4px"> 添加指标体系 </zk-button>
    <zk-tree
      ref="ZkTreeRef"
      :active="{ append: true, edit: false, remove: true, check: false }"
      :load="getTreeConfig"
      :custom-props="{ label: 'indicatorName' }"
      lazy
      node-key="id"
      @node-click="viewNode"
      @remove-node="removeNode"
    ></zk-tree>
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
import { Plus } from '@element-plus/icons-vue'
import ZkTree from '@/components/zk-tree.vue'
import { reactive, ref } from 'vue'
import type { LoadFunction } from 'element-plus'
import { RenderContentContext } from 'element-plus'
import indicatorTemplate from '../indicatorTemplate.json'
import { addIndicatorApi, getIndicatorDetail, getIndicatorListApi, removeIndicatorApi } from '@/api/indicatorManage'
import ZkForm from '@/components/zk-form.vue'
import { GetIndicatorListApiRes } from '@/api/indicatorManage/types.ts'
import { addRootFormConfig } from '@/views/systemManage/indicatorManage/configs/formConfigs.ts'

type Node = RenderContentContext['node']
type Data = RenderContentContext['data']

const emit = defineEmits<{
  'view-node': [data: Data, node: Node]
}>()
const ZkTreeRef = ref<InstanceType<typeof ZkTree>>()
const addRootFormRef = ref<InstanceType<typeof ZkForm>>()
const addRootDialogShow = ref(false)
const indicatorConfigFormData = reactive({
  parent: '',
  indicatorName: '',
  indicatorDesc: '',
  type: '',
  config: JSON.stringify(indicatorTemplate, null, 2),
})
const addRootFormData = reactive({
  indicatorName: '',
  indicatorDesc: '',
})
const addRootFormRules = {
  indicatorName: [{ required: true, message: '请输入指标名称', trigger: 'blur' }],
}
const rootNode = ref()
const rootResolve = ref()
const rootReject = ref()

// 获取树
const getTreeConfig: LoadFunction = async (node, resolve, reject) => {
  if (node.level === 0) {
    rootNode.value = node
    rootResolve.value = resolve
    rootReject.value = reject
    return resolve((await getIndicatorList(0)).data!)
  }
  if (node.level >= 1) {
    const res = await getIndicatorList(node.data.id)
    if (res?.status === 200) {
      return resolve(res.data!)
    } else {
      ElMessage.error('节点加载失败，请重试')
      return reject!()
    }
  }
}
const getIndicatorList = async (id = 0): Promise<ResponseData<GetIndicatorListApiRes[]>> => {
  const params = {
    id,
  }
  return await getIndicatorListApi(params)
}
// 查看节点
const viewNode = async (data: Data, node: Node) => {
  const self = data
  const parent = node.parent?.data
  const res = await getIndicatorDetail({ nodeId: self.id })
  const { indicatorName, description, type, config, formConfig } = res.data
  indicatorConfigFormData.parent = parent?.label
  indicatorConfigFormData.indicatorName = indicatorName
  indicatorConfigFormData.indicatorDesc = description
  indicatorConfigFormData.type = type
  indicatorConfigFormData.config = config
  indicatorConfigFormData.config = formConfig
  emit('view-node', data, node)
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
    await addIndicatorApi(addRootFormData)
    rootNode.value.childNodes = []
    getTreeConfig(rootNode.value, rootResolve.value, rootReject.value)
    closeRootDialog()
  } catch (e) {
    console.error(e)
  }
}
const removeNode = async (node: Node, data: Data) => {
  const nodeId = data.id
  ElMessageBox.confirm('是否删除该节点和它的所有子节点？', '警告', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    draggable: true,
  }).then(async () => {
    const res = await removeIndicatorApi({ id: nodeId })
    if (res.status === 200) {
      ZkTreeRef.value?.ElTreeRef?.remove(node)
      ElMessage.success('删除成功')
    } else {
      ElMessage.error('删除失败')
    }
  })
}
</script>

<style scoped lang="scss">
.tree {
  overflow-y: auto;
  width: 100%;
  height: 600px;
  border: 1px solid $border-color1;
}
</style>
