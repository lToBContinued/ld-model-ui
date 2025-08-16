<template>
  <el-collapse>
    <el-collapse-item v-for="item in tree" :key="item.id" :name="item.id">
      <template #title>
        <div class="title-wrapper">
          <span class="title">{{ item.title }}</span>
          <div style="display: flex">
            <zk-button size="small" @click.stop="addNode(item)">添加子指标</zk-button>
            <zk-button type="text" size="small" @click.stop="remove(item)">删除</zk-button>
          </div>
        </div>
      </template>
      <div :class="`content-${item.level}`">
        <span :class="`desc-${item.level}`" v-if="item.desc">{{ item.desc }}</span>
        <scheme-collapse v-if="item.children && item.children.length > 0" v-model="item.children" />
      </div>
    </el-collapse-item>
  </el-collapse>
  <zk-dialog
    v-model="addChildIndicatorDialogShow"
    width="500px"
    @close="closeAddChildIndicatorDialog"
    @cancel="closeAddChildIndicatorDialog"
    @confirm="confirmAddChildIndicator"
  >
    <zk-form
      ref="addChildIndicatorRef"
      v-model:form-config="addChildIndicatorFormConfig"
      v-model:form-data="addChildIndicatorFormData"
      label-width="100"
    ></zk-form>
  </zk-dialog>
</template>

<script setup lang="ts">
import { watch, reactive, ref } from 'vue'
import { AddChildIndicatorFormData, buildSchemeTreeItem } from '@/views/systemManage/types.ts'
import { addChildIndicatorFormConfig } from '@/views/systemManage/schemeManage/configs/formConfigs.ts'
import ZkForm from '@/components/zk-form.vue'

interface DefineProps {
  modelValue: buildSchemeTreeItem[]
}

const props = withDefaults(defineProps<DefineProps>(), {})

const emit = defineEmits(['update:modelValue'])
const tree = reactive<buildSchemeTreeItem[]>([...props.modelValue])
const addChildIndicatorDialogShow = ref(false)
const parentNode = ref<buildSchemeTreeItem>()
const addChildIndicatorRef = ref<InstanceType<typeof ZkForm>>()
const addChildIndicatorFormData = reactive<AddChildIndicatorFormData>({
  indicatorName: '',
  indicatorDesc: '',
})

watch(
  () => props.modelValue,
  (newVal) => {
    // 深拷贝确保响应式
    tree.splice(0, tree.length, ...JSON.parse(JSON.stringify(newVal)))
  },
  { deep: true },
)

watch(
  () => tree,
  (newVal) => {
    console.log('>>>>> file: scheme-collapse.vue ~ method: 组件 <<<<<\n', newVal) // TODO: 删除
    emit('update:modelValue', newVal)
  },
  { deep: true },
)

// 添加节点
const addNode = (parent: buildSchemeTreeItem) => {
  addChildIndicatorDialogShow.value = true
  parentNode.value = parent
}
const closeAddChildIndicatorDialog = () => {
  addChildIndicatorRef.value?.ElFormRef?.resetFields()
  addChildIndicatorDialogShow.value = false
}
const confirmAddChildIndicator = async () => {
  try {
    await addChildIndicatorRef.value?.ElFormRef?.validate()
    const newNode: buildSchemeTreeItem = {
      id: `${parentNode.value?.id}-${Date.now()}`,
      title: addChildIndicatorFormData.indicatorName,
      desc: addChildIndicatorFormData.indicatorDesc,
      level: parentNode.value?.level ? parentNode.value.level + 1 : 1,
      children: [],
    }
    if (parentNode.value) {
      if (!parentNode.value.children) {
        parentNode.value.children = []
      }
      parentNode.value.children.push(newNode)
    }
    closeAddChildIndicatorDialog()
  } catch (e) {
    console.error('表单验证失败', e)
  }
}
/**
 * @description 删除目标节点（含子节点连带删除）
 * @param self 待删除的节点数据（buildSchemeTreeItem类型）
 */
const remove = async (self: buildSchemeTreeItem) => {
  const hasChildren = self.children && self.children.length > 0
  if (hasChildren) {
    try {
      await ElMessageBox.confirm('该节点存在子节点，是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      performDelete(self)
    } catch (e) {
      return
    }
  } else {
    performDelete(self)
  }
}
/**
 * @description 辅助函数：递归查找目标节点的父节点及所在的children数组
 * @param nodes 待遍历的节点数组
 * @param targetId 目标节点ID
 * @returns 父节点 + 目标节点所在的children数组（未找到则返回null）
 */
const findParent = (
  nodes: buildSchemeTreeItem[],
  targetId: string,
): { parent: buildSchemeTreeItem | null; list: buildSchemeTreeItem[] | null } => {
  for (const node of nodes) {
    // 检查当前节点的children是否包含目标节点
    if (node.children && node.children.some((item) => item.id === targetId)) {
      return { parent: node, list: node.children }
    }
    // 递归遍历子节点
    const result = findParent(node.children || [], targetId)
    if (result.parent) {
      return result
    }
  }
  // 未找到父节点（说明是顶层节点）
  return { parent: null, list: null }
}
/**
 * @description 执行实际的删除操作
 * @param self 待删除的节点数据
 */
const performDelete = (self: buildSchemeTreeItem) => {
  const { parent, list } = findParent(tree, self.id)
  if (list && parent) {
    parent.children = list.filter((item) => item.id !== self.id)
  } else {
    const targetIndex = tree.findIndex((item) => item.id === self.id)
    if (targetIndex > -1) {
      tree.splice(targetIndex, 1)
    }
  }
}
</script>

<style scoped lang="scss">
$spacing-indent: 16px; // 缩进间距

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

[class^='content-'] {
  padding-top: $spacing-size1;
}

[class^='desc-'] {
  font-size: $font-size-s;
  color: $main-text-color2;
  margin: 0 0 $spacing-size1 0;
  line-height: 1.6;
}

// 不同级别缩进样式
@for $i from 1 through 10 {
  .content-#{$i} {
    position: relative;
    padding-left: $i * $spacing-indent;
  }
  .desc-#{$i} {
    position: relative;
    left: -$i * $spacing-indent;
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
