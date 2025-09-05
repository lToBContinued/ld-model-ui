<template>
  <el-collapse class="scheme-collapse">
    <el-collapse-item v-for="item in indicatorList" :key="item.id">
      <template #title>
        <div class="title-wrapper">
          <span class="title">{{ item.name }}</span>
          <div style="display: flex">
            <zk-button size="small" @click.stop="openAddChildIndicatorDialog(item)">添加子指标 </zk-button>
            <zk-button type="danger" link @click.stop="removeNode(item)">删除</zk-button>
          </div>
        </div>
      </template>
      <div class="content">
        <span class="desc" v-if="item.description">{{ item.description }}</span>
        <scheme-collapse
          v-if="item.children && item.children.length > 0"
          v-model="item.children"
          :subtree-id="subtreeId"
        ></scheme-collapse>
      </div>
    </el-collapse-item>
  </el-collapse>
  <zk-dialog
    v-model="addChildIndicatorDialogShow"
    width="500px"
    @cancel="closeAddChildIndicatorDialog"
    @close="closeAddChildIndicatorDialog"
    @confirm="confirmAddChildIndicatorDialog"
    @open="addChildIndicatorDialogOpen"
  >
    <template #title>
      <span style="font-size: 18px">添加子指标</span>
    </template>
    <zk-form
      ref="addChildIndicatorRef"
      v-model="addChildIndicatorFormData"
      :form-config="addChildIndicatorFormConfig"
      label-width="80"
    ></zk-form>
  </zk-dialog>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import {
  AddChildrenIndicatorFormData,
  AddSecondIndicatorFormConfigItem,
  ConfirmAdd,
  SchemeIndicatorConfigItem,
} from '@/views/assessTargetSystem/types.ts'
import ZkForm from '@/components/zk/zk-form.vue'
import { getIndicatorAndDescendantsApi } from '@/api/indicatorManage/index.ts'
import { deleteSchemeNode, updateSchemeApi } from '@/api/schemeManage'

interface DefineProps {
  modelValue?: SchemeIndicatorConfigItem[]
  indicatorOptions?: { label: string; value: number }[]
  subtreeId: number // 方案id
}

const props = withDefaults(defineProps<DefineProps>(), {})
const indicatorList = ref<SchemeIndicatorConfigItem[]>(props.modelValue!)
const addChildIndicatorRef = ref<InstanceType<typeof ZkForm>>()
const addChildIndicatorDialogShow = ref(false)
const parentNode = ref<SchemeIndicatorConfigItem>()
const addChildIndicatorFormData = ref<AddChildrenIndicatorFormData>({
  indicatorId: undefined,
  description: '',
})
const addChildIndicatorFormConfig = ref<AddSecondIndicatorFormConfigItem[]>([
  {
    prop: 'indicatorId',
    label: '指标名称',
    type: 'select',
    rules: [{ required: true, message: '请输入指标名称', trigger: 'blur' }],
    config: {
      options: [],
    },
  },
  {
    prop: 'description',
    label: '指标描述',
    type: 'input',
    config: {
      type: 'textarea',
    },
  },
])
const parentOptions = ref<{ label: string; value: number }[]>([])

watch(
  () => props.modelValue,
  (newVal) => {
    indicatorList.value = newVal as SchemeIndicatorConfigItem[]
  },
  { deep: true },
)

const addChildIndicatorDialogOpen = async () => {
  const parentId = parentNode.value?.refIndicatorId as number
  if (!parentId) {
    console.error('无效的parentId:', parentNode.value?.refIndicatorId)
    return
  }
  // 获取指标名称列表
  const res = await getIndicatorAndDescendantsApi(parentId)
  parentOptions.value = res.data!.map((item) => {
    return {
      label: item.name,
      value: item.id,
    }
  })
  addChildIndicatorFormConfig.value[0].config!.options = parentOptions.value
}
const getIndicatorName = (id: number) => {
  return parentOptions.value.find((item) => item.value === id)?.label
}
// 添加节点
const openAddChildIndicatorDialog = (node: SchemeIndicatorConfigItem) => {
  addChildIndicatorDialogShow.value = true
  parentNode.value = node
}
const confirmAddChildIndicatorDialog = async () => {
  try {
    await addChildIndicatorRef.value?.ElFormRef?.validate()
    const data = {
      children: [],
      indicatorName: getIndicatorName(addChildIndicatorFormData.value.indicatorId as number),
      ...addChildIndicatorFormData.value,
    }
    await confirmAdd(indicatorList.value, data)
    closeAddChildIndicatorDialog()
  } catch (e) {
    console.error(e)
  }
}
const confirmAdd: ConfirmAdd = async (tree, newNode) => {
  // 先获取并检查 parentId 的值
  const parentId = parentNode.value?.id
  // 如果 parentId 不存在，直接返回避免错误
  if (parentId === undefined) {
    console.error('父节点ID不存在，无法添加子节点')
    return
  }
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].id === parentId) {
      if (!tree[i].children) {
        tree[i].children = []
      }
      const data = {
        parentId: parentId,
        refIndicatorId: newNode.indicatorId as number,
        name: newNode.indicatorName,
      }
      const res = await updateSchemeApi(props.subtreeId, data)
      const pushNewNodeData = {
        id: res.data,
        name: newNode.indicatorName,
        description: newNode.description,
        parentId: parentId,
        refIndicatorId: newNode.indicatorId as number,
      }
      tree[i].children!.push(pushNewNodeData)
    } else if (tree[i].children) {
      // 检查 children 存在再递归
      confirmAdd(tree[i].children, newNode)
    }
  }
}
const closeAddChildIndicatorDialog = () => {
  addChildIndicatorRef.value?.ElFormRef?.resetFields()
  addChildIndicatorDialogShow.value = false
}
const removeNode = (node: SchemeIndicatorConfigItem) => {
  // 检查节点ID是否存在
  if (!node.id) {
    ElMessage.error('节点ID不存在，无法删除')
    return
  }
  const handleDelete = async () => {
    try {
      await deleteSchemeNode(node.id)
      confirmRemoveNode(indicatorList.value, node.id)
      ElMessage.success('删除成功')
    } catch (error) {
      ElMessage.error('删除失败，请稍后重试')
      console.error(error)
    }
  }
  // 如果有子节点，需要二次确认
  if (node.children && node.children.length > 0) {
    ElMessageBox.confirm('这个节点下有子节点，确定删除吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(handleDelete)
  } else {
    handleDelete()
  }
}
const confirmRemoveNode = (tree: SchemeIndicatorConfigItem[], id: number): SchemeIndicatorConfigItem[] => {
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].id === id) {
      tree.splice(i, 1)
      return tree
    }
    if (tree[i].children && tree[i].children!.length > 0) {
      tree[i].children = confirmRemoveNode(tree[i].children!, id)
    }
  }
  return tree
}
</script>

<style scoped lang="scss">
$spacing-indent: 16px; // 缩进间距

.scheme-collapse {
  margin-top: $spacing-size2;

  .title-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .title {
      font-size: $font-size-l;
      font-weight: 500;
    }
  }

  .content {
    padding-top: $spacing-size1;
    padding-left: $spacing-indent;
  }

  .desc {
    margin: 0 0 $spacing-size1;
    font-size: $font-size-s;
    line-height: 1.6;
    color: $main-text-color2;
  }
}

// 子级折叠面板样式
::v-deep(.el-collapse) {
  margin-top: $spacing-size1;
}

::v-deep(.el-collapse-item__content) {
  padding-bottom: $spacing-size2;
}
</style>
