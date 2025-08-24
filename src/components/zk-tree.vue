<template>
  <div class="zk-tree">
    <zk-input v-if="filter" v-model="filterText" placeholder="请输入搜索内容"></zk-input>
    <el-tree
      ref="ElTreeRef"
      v-model:data="dataSource"
      :active="active"
      :default-checked-keys="defaultCheckedKeys"
      :default-expanded-keys="defaultExpandedKeys"
      :expand-on-click-node="expandOnClickNode"
      :filter-node-method="filterNode"
      :highlight-current="highlightCurrent"
      :lazy="lazy"
      :node-key="nodeKey"
      :props="customProps"
      :show-checkbox="showCheckbox"
      class="user-unselect"
      v-bind="$attrs"
    >
      <template v-if="active" #default="{ node, data }">
        <div class="custom-tree-node">
          <span>{{ node.label }}</span>
          <div>
            <zk-button v-if="active.append" type="primary" link @click.stop="append(node, data)"> 添加 </zk-button>
            <zk-button v-if="active.edit" type="primary" link @click.stop="edit(node, data)" style="margin-left: 4px">
              修改
            </zk-button>
            <zk-button
              v-if="active.remove"
              type="danger"
              link
              @click.stop="remove(node, data)"
              style="margin-left: 4px"
            >
              删除
            </zk-button>
          </div>
        </div>
      </template>
    </el-tree>
    <zk-dialog v-model="dialogShow" width="500px" @cancel="closeDialog" @close="closeDialog" @confirm="confirmAppend">
      <template #header>
        <span style="font-size: 18px">添加节点</span>
      </template>
      <zk-form
        ref="indicatorFormRef"
        v-model:form-config="indicatorFormConfig"
        v-model:form-data="indicatorFormData"
        :label-width="130"
        :rules="indicatorFormRules"
      ></zk-form>
    </zk-dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * @description
 * @param { TreeOptionProps } customProps 为避免冲突，将原本的props换成了customProps
 */
import { ref, reactive, watch } from 'vue'
import { TreeData, TreeKey, TreeOptionProps } from 'element-plus/es/components/tree/src/tree.type'
import { FilterNodeMethodFunction, RenderContentContext, TreeInstance } from 'element-plus'
import ZkForm from '@/components/zk-form.vue'

interface ZkTreeProps {
  data?: TreeData
  customProps?: TreeOptionProps
  maxWidth?: string
  showCheckbox?: boolean
  lazy?: boolean
  nodeKey?: string
  defaultCheckedKeys?: TreeKey[]
  defaultExpandedKeys?: TreeKey[]
  expandOnClickNode?: boolean
  // 是否为活动的树（可以添加、修改或删除节点）
  active?: {
    append: boolean
    edit: boolean
    remove: boolean
    check: boolean
  }
  highlightCurrent?: boolean
  background?: string // 背景颜色
  filter?: boolean
}

type Node = RenderContentContext['node']
type Data = RenderContentContext['data']

const props = withDefaults(defineProps<ZkTreeProps>(), {
  maxWidth: '100%',
  highlightCurrent: true,
  customProps: {
    label: 'label',
    children: 'children',
  },
  background: '#fff',
  filter: false,
})

const PROPS: Record<string, any> = {
  label: props.customProps.label || 'label',
  children: props.customProps.children || 'children',
  disabled: props.customProps.disabled || 'disabled',
  isLeaf: props.customProps.isLeaf || 'isLeaf',
  class: props.customProps.class,
}
const emit = defineEmits<{
  'remove-node': [node: Node, data: Data]
  'append-node': [node: Node, data: Data]
}>()
const ElTreeRef = ref<TreeInstance>()
const dataSource = reactive<TreeData>(props.data)
const filterText = ref('')
const dialogShow = ref(false)
const indicatorFormData = reactive({
  [PROPS.label]: '',
})
const indicatorFormConfig = reactive([
  {
    prop: PROPS.label,
    label: '节点名称',
    type: 'input',
  },
])
const indicatorFormRules = reactive({
  [PROPS.label]: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
  [PROPS.isLeaf]: [{ required: true, message: '请选择是否为叶子节点', trigger: 'blur' }],
})
const currentNodeData = ref<Data>()
const indicatorFormRef = ref<InstanceType<typeof ZkForm>>()

watch(filterText, (val) => {
  ElTreeRef.value!.filter(val)
})

// 关键字搜索
const filterNode: FilterNodeMethodFunction = (value: string, data: any) => {
  if (!value) return true
  return data[PROPS.label].includes(value)
}
// 添加节点
const append = (node: Node, data: Data) => {
  // dialogShow.value = true
  // currentNodeData.value = data
  emit('append-node', node, data)
}
const confirmAppend = async () => {
  try {
    await indicatorFormRef.value?.ElFormRef?.validate()
    const newChild = {
      id: Date.now(),
      [PROPS.children]: [],
      ...indicatorFormData,
    }
    if (!currentNodeData.value![PROPS.children]) {
      currentNodeData.value![PROPS.children] = []
    }
    currentNodeData.value![PROPS.children].push(newChild)
    closeDialog()
  } catch (e) {
    console.error(e)
  }
}
// 删除节点
const remove = (node: Node, data: Data) => {
  /*const parent = node.parent
  const children: TreeData[] = parent?.data[PROPS.children] || parent?.data
  const index = children.findIndex((d) => d.id === data.id)
  if (node.level === 1) {
    ElMessage.error('根节点不能删除')
    return
  }
  if (node.childNodes.length > 0) {
    ElMessageBox.confirm('该节点下有子节点，是否删除子节点？', '删除节点', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      draggable: true,
    }).then(() => {
      children.splice(index, 1)
    })
  } else {
    children.splice(index, 1)
  }*/
  /*const currentNode = ElTreeRef.value?.getNode(node)
  if (currentNode!.level === 1) {
    ElMessageBox.confirm('此节点为根节点，请检查是否有子节点后，在确定是否删除！', '警告', {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      draggable: true,
    }).then(() => {
      ElTreeRef.value?.remove(node)
    })
    return
  }
  if (currentNode!.childNodes.length > 0) {
    ElMessageBox.confirm('该节点下有子节点，是否删除子节点？', '删除节点', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      draggable: true,
    }).then(() => {
      ElTreeRef.value?.remove(node)
    })
  } else {
    ElTreeRef.value?.remove(node)
  }*/
  emit('remove-node', node, data)
}
// 修改节点
const edit = (node: Node, data: Data) => {
  ElMessageBox.prompt('', '输入节点名称', {
    confirmButtonText: '修改',
    cancelButtonText: '取消',
    draggable: true,
  }).then(({ value }) => {
    data[PROPS.label] = value
  })
}
const closeDialog = () => {
  indicatorFormRef.value?.ElFormRef?.resetFields()
  dialogShow.value = false
}

defineExpose({ ElTreeRef })
</script>

<style scoped lang="scss">
.zk-tree {
  max-width: v-bind('maxWidth');
  background: v-bind(background);
}

.custom-tree-node {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;

  padding-right: 8px;
}

.el-tree {
  background: transparent;
}

::v-deep(.el-button) {
  font-weight: 700;
}

.zk-input {
  width: fit-content;

  ::v-deep(.el-input) {
    width: 240px !important;
    max-width: calc(v-bind('maxWidth') - 16px);
    margin: 8px;
  }
}

::v-deep(.el-tree) {
  .el-tree-node {
    background: transparent;
  }

  .el-tree-node__content {
    height: 28px;
    font-size: $font-size-s;
    background-color: #1e2023;
  }

  .el-tree__empty-block {
    background-color: #1e2023;
  }
}
</style>
