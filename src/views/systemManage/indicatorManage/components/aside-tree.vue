<template>
  <div class="tree">
    <zk-button type="primary" @click="addRoot" :icon="Plus" style="margin: 4px 0 0 4px"> 添加指标体系 </zk-button>
    <zk-tree
      ref="ZkTreeRef"
      :active="{ append: true, edit: false, remove: true, check: false }"
      :custom-props="{ label: 'indicatorName' }"
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
import ZkTree from '@/components/zk-tree.vue'
import { reactive, ref } from 'vue'
import type { LoadFunction } from 'element-plus'
import { RenderContentContext } from 'element-plus'
import { addIndicatorApi, getIndicatorListApi, removeIndicatorApi } from '@/api/indicatorManage'
import ZkForm from '@/components/zk-form.vue'
import { GetIndicatorListApiRes } from '@/api/indicatorManage/types.ts'
import { addChildNodeFormConfig, addRootFormConfig } from '@/views/systemManage/indicatorManage/configs/formConfigs.ts'

type Node = RenderContentContext['node']
type Data = RenderContentContext['data']

const emit = defineEmits<{
  'view-node': [data: Data, node: Node]
}>()
const ZkTreeRef = ref<InstanceType<typeof ZkTree>>()
const addRootFormRef = ref<InstanceType<typeof ZkForm>>()
const addRootDialogShow = ref(false)
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
const currentNode = ref<Node>()
const currentData = ref<Data>()
const addChildNodeFormRef = ref<InstanceType<typeof ZkForm>>()
const addChildNodeDialogShow = ref(false)
const addChildNodeFormData = reactive({
  indicatorName: '',
  indicatorDesc: '',
})

// 获取树
const getTreeConfig: LoadFunction = async (node, resolve, reject) => {
  if (node.level === 0) {
    rootNode.value = node
    rootResolve.value = resolve
    rootReject.value = reject
    await getFirstLevelTreeData(resolve)
  }
  if (node.level >= 1) {
    await getIndex(node, resolve)
  }
}
// 首次获取根节点数据
const getFirstLevelTreeData = async (resolve: any) => {
  const res = await getIndicatorListApi({ id: 0 })
  resolve(res.data!)
}
// 加载叶子结点数据
const getIndex = async (node: Node, resolve: any) => {
  const data = await getIndicatorDetail(node.data.id)
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
    await addIndicatorApi(addRootFormData)
    refreshTree()
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
  const data = {
    indicatorName: addChildNodeFormData.indicatorName,
    indicatorDesc: addChildNodeFormData.indicatorDesc,
    parentId,
  }
  const res = await addIndicatorApi(data)
  if (res.status === 200) {
    ElMessage.success('添加成功')
    refreshTree()
    console.log('>>>>> file: aside-tree.vue ~ method: submitAddChildNodeDialog <<<<<\n', defaultExpandIds.value)
    closeAddChildNodeDialog()
  } else {
    ElMessage.error('添加失败')
  }
}
// 刷新树
const refreshTree = () => {
  rootNode.value.childNodes = []
  getTreeConfig(rootNode.value, rootResolve.value, rootReject.value)
}

defineExpose({ refreshTree })
</script>

<style scoped lang="scss">
.tree {
  overflow-y: auto;
  width: 100%;
  height: 600px;
  border: 1px solid $border-color1;
}
</style>
