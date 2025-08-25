<template>
  <div class="tree">
    <zk-button type="primary" @click="addRoot" :icon="Plus" style="margin: 4px 0 0 4px"> 添加指标体系 </zk-button>
    <zk-tree
      ref="ZkTreeRef"
      :active="{ append: true, edit: false, remove: true, check: false }"
      :custom-props="{ label: 'name' }"
      :load="getTreeConfig"
      lazy
      node-key="id"
      @node-click="viewNode"
      @remove-node="removeNode"
      @append-node="openAppendNode"
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
    <zk-dialog
      v-model="addChildNodeDialogShow"
      width="450px"
      @cancel="closeAddChildNodeDialog"
      @close="closeAddChildNodeDialog"
      @confirm="submitAddChildNodeDialog"
    >
      <template #header>
        <span style="font-size: 18px">添加指标</span>
      </template>
      <zk-form
        ref="addChildNodeFormRef"
        v-model:form-config="addChildNodeFormConfig"
        v-model:form-data="addChildNodeFormData"
        label-width="80"
      ></zk-form>
    </zk-dialog>
  </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import ZkTree from '@/components/zk/zk-tree.vue'
import { reactive, ref } from 'vue'
import type { LoadFunction } from 'element-plus'
import { RenderContentContext } from 'element-plus'
import { addIndicatorApi, getIndicatorListApi, removeIndicatorApi } from '@/api/indicatorManage/index.ts'
import ZkForm from '@/components/zk/zk-form.vue'
import { AddIndicatorApiSend, GetIndicatorListApiRes } from '@/api/indicatorManage/types.ts'
import {
  addChildNodeFormConfig,
  addRootFormConfig,
} from '@/views/assessTargetSystem/indicatorManage/configs/formConfigs.ts'
import { AddChildNodeFormData } from '@/views/assessTargetSystem/types.ts'

type Node = RenderContentContext['node']
type Data = RenderContentContext['data']

const emit = defineEmits<{
  'view-node': [data: Data, node: Node]
  'remove-node': []
}>()
const ZkTreeRef = ref<InstanceType<typeof ZkTree>>()
const addRootFormRef = ref<InstanceType<typeof ZkForm>>()
const addRootDialogShow = ref(false)
const addRootFormData = reactive({
  name: '',
  description: '',
  parentId: 0,
})
const addRootFormRules = {
  name: [{ required: true, message: '请输入指标名称', trigger: 'blur' }],
}
const rootNode = ref()
const rootResolve = ref()
const rootReject = ref()
const currentNode = ref<Node>()
const currentData = ref<Data>()
const addChildNodeFormRef = ref<InstanceType<typeof ZkForm>>()
const addChildNodeDialogShow = ref(false)
const addChildNodeFormData = reactive<AddChildNodeFormData>({
  name: '',
  description: '',
  systemId: '',
})

// 获取树
const getTreeConfig: LoadFunction = async (node, resolve, reject) => {
  if (node.level === 0) {
    rootNode.value = node
    rootResolve.value = resolve
    rootReject.value = reject
    await getTreeNode(0, resolve)
  }
  if (node.level >= 1) {
    await getTreeNode(node.data.id, resolve)
  }
}
// 生成树节点
const getTreeNode = async (id: number, resolve: any) => {
  const data = await getIndicatorDetail(id)
  resolve(data)
}
// 获取树的数据
const getIndicatorDetail = async (id: number): Promise<GetIndicatorListApiRes[]> => {
  const res = await getIndicatorListApi({ id })
  return res.data!
}
// 查看节点
const viewNode = async (data: Data, node: Node) => {
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
    await addIndicatorApi(addRootFormData as AddIndicatorApiSend)
    refreshStandar('add')
    closeRootDialog()
  } catch (e) {
    console.error(e)
  }
}
// 删除节点
const removeNode = async (node: Node, data: Data) => {
  currentNode.value = node
  currentData.value = data
  ElMessageBox.confirm('是否删除该节点和它的所有子节点？', '警告', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    draggable: true,
  }).then(async () => {
    const res = await removeIndicatorApi({ id: currentData.value!.id })
    if (res.status === 200) {
      ZkTreeRef.value?.ElTreeRef?.remove(node)
      ElMessage.success('删除成功')
      emit('remove-node')
    } else {
      ElMessage.error('删除失败')
    }
  })
}
// 添加子节点
const openAppendNode = async (node: Node, data: Data) => {
  currentNode.value = node
  currentData.value = data
  addChildNodeDialogShow.value = true
}
const closeAddChildNodeDialog = () => {
  addChildNodeFormRef.value?.ElFormRef?.resetFields()
  addChildNodeDialogShow.value = false
}
const submitAddChildNodeDialog = async () => {
  await addChildNodeFormRef.value?.ElFormRef?.validate()
  const parentId = currentData.value!.id
  const systemId = currentData.value!.systemId
  const data = {
    name: addChildNodeFormData.name,
    description: addChildNodeFormData.description,
    systemId,
    parentId,
  } as AddIndicatorApiSend
  const res = await addIndicatorApi(data)
  if (res.status === 200) {
    ElMessage.success('添加成功')
    refreshStandar('add')
    closeAddChildNodeDialog()
  } else {
    ElMessage.error('添加失败')
  }
}
// 刷新节点
const refreshNodeBy = (id: number) => {
  const node = ZkTreeRef.value?.ElTreeRef?.getNode(id) as Node
  node.loaded = false
  node.expand()
}
const refreshStandar = (data: string) => {
  let id_ = data === 'add' ? currentData.value!.id : currentData.value!.parentId
  refreshNodeBy(id_)
}

defineExpose({ refreshStandar })
</script>

<style scoped lang="scss">
.tree {
  overflow-y: auto;
  width: 100%;
  height: 600px;
  border: 1px solid $border-color1;
}
</style>
