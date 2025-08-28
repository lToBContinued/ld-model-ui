<template>
  <div class="tree">
    <zk-button type="primary" @click="addRoot" :icon="Plus" style="margin: 4px 0 0 4px"> 添加指标体系 </zk-button>
    <zk-tree
      v-if="treeShow"
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
          v-model="addRootFormData"
          :form-config="addRootFormConfig"
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
        v-model="addChildNodeFormData"
        :form-config="addChildNodeFormConfig"
        label-width="80"
      ></zk-form>
    </zk-dialog>
  </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import ZkTree from '@/components/zk/zk-tree.vue'
import { nextTick, ref, shallowRef } from 'vue'
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
const ZkTreeRef = shallowRef<InstanceType<typeof ZkTree>>()
const addRootFormRef = shallowRef<InstanceType<typeof ZkForm>>()
const addChildNodeFormRef = shallowRef<InstanceType<typeof ZkForm>>()
const addRootDialogShow = ref(false)
const addRootFormData = ref({
  name: '',
  description: '',
  parentId: 0,
})
const addRootFormRules = {
  name: [{ required: true, message: '请输入指标名称', trigger: 'blur' }],
}
const currentNode = ref<Node>() // 当前节点Node对象
const currentData = ref<Data>() // 当前节点数据
const addChildNodeDialogShow = ref(false)
const addChildNodeFormData = ref<AddChildNodeFormData>({
  name: '',
  description: '',
  systemId: '',
})
const treeShow = ref(true)

/**
 * @description 懒加载获取树节点
 * @see http://element-plus.org/zh-CN/component/tree.html#%E6%87%92%E5%8A%A0%E8%BD%BD%E8%87%AA%E5%AE%9A%E4%B9%89%E5%8F%B6%E5%AD%90%E8%8A%82%E7%82%B9
 * @param {Node} node 节点
 * @param {function} resolve 成功回调
 * @param {function} reject 失败回调
 */
const getTreeConfig: LoadFunction = async (node, resolve, reject) => {
  if (node.level === 0) {
    await getTreeNode(0, resolve)
  }
  if (node.level >= 1) {
    await getTreeNode(node.data.id, resolve)
  }
}
/**
 * @description 添加树节点
 * @param {number} id 节点id
 * @param {function} resolve 成功回调
 */
const getTreeNode = async (id: number, resolve: any) => {
  const data = await getIndicatorDetail(id)
  resolve(data)
}
/**
 * @description 获取树节点的数据
 * @param {number} id 节点id
 * @returns {Promise<GetIndicatorListApiRes[]>} 树节点数据
 */
const getIndicatorDetail = async (id: number): Promise<GetIndicatorListApiRes[]> => {
  const res = await getIndicatorListApi({ id })
  return res.data!
}
/**
 * @description 查看节点
 * @param {Data} data 节点数据
 * @param {Node} node 节点
 */
const viewNode = async (data: Data, node: Node) => {
  currentData.value = data
  emit('view-node', data, node)
}
const addRoot = () => {
  addRootDialogShow.value = true
}
const closeRootDialog = () => {
  addRootFormRef.value?.ElFormRef?.resetFields()
  addRootDialogShow.value = false
}
/**
 * @description 添加指标体系根节点
 */
const submitAddRootDialog = async () => {
  try {
    await addRootFormRef.value?.ElFormRef?.validate()
    await addIndicatorApi(addRootFormData.value as AddIndicatorApiSend)
    await refreshAllTree()
    closeRootDialog()
  } catch (e) {
    console.error(e)
  }
}
/**
 * @description 删除节点
 * @param {Node} node 节点
 * @param {Data} data 节点数据
 */
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
const openAppendNode = async (node: Node, data: Data) => {
  currentNode.value = node
  currentData.value = data
  addChildNodeDialogShow.value = true
}
const closeAddChildNodeDialog = () => {
  addChildNodeFormRef.value?.ElFormRef?.resetFields()
  addChildNodeDialogShow.value = false
}
/**
 * @description 添加子节点
 */
const submitAddChildNodeDialog = async () => {
  await addChildNodeFormRef.value?.ElFormRef?.validate()
  const parentId = currentData.value!.id
  const systemId = currentData.value!.systemId
  const data = {
    name: addChildNodeFormData.value.name,
    description: addChildNodeFormData.value.description,
    systemId,
    parentId,
  } as AddIndicatorApiSend
  const res = await addIndicatorApi(data)
  if (res.status === 200) {
    ElMessage.success('添加成功')
    refreshChildNodes('add')
    closeAddChildNodeDialog()
  } else {
    ElMessage.error('添加失败')
  }
}
/**
 * @description 刷新非根节点
 * @see https://www.cnblogs.com/lwming/p/13969513.html#!comments
 * @param {string} data 刷新类型，add 表示添加节点，此时刷新的是当前节点，否则刷新当前节点的父节点
 */
const refreshChildNodes = (data: string) => {
  let id_ = data === 'add' ? currentData.value!.id : currentData.value!.parentId
  refreshNodeBy(id_)
}
/**
 * @description 刷新方法
 * @param {number} id 节点id
 */
const refreshNodeBy = (id: number) => {
  const node = ZkTreeRef.value?.ElTreeRef?.getNode(id) as Node
  if (node) {
    node.loaded = false
    node.expand()
  } else {
    refreshAllTree()
  }
}
/**
 * @description 当进行和根节点有关的操作时候用这个方法刷新树（卸载再加载），因为此时没有父节点了，不能再刷新父节点
 */
const refreshAllTree = async () => {
  treeShow.value = false
  await nextTick()
  treeShow.value = true
}

defineExpose({ refreshAllTree, refreshChildNodes })
</script>

<style scoped lang="scss">
.tree {
  overflow-y: auto;
  width: 100%;
  height: 600px;
  border: 1px solid $border-color1;
}
</style>
