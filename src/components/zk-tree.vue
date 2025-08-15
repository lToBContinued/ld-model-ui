<template>
  <div class="zk-tree">
    <zk-input v-if="filter" v-model="filterText" placeholder="请输入搜索内容"></zk-input>
    <el-tree
      ref="ElTreeRef"
      class="user-unselect"
      v-model:data="dataSource"
      :props="customProps"
      :show-checkbox="showCheckbox"
      :lazy="lazy"
      :node-key="nodeKey"
      :default-checked-keys="defaultCheckedKeys"
      :default-expanded-keys="defaultExpandedKeys"
      :expand-on-click-node="expandOnClickNode"
      :active="active"
      :highlight-current="highlightCurrent"
      :filter-node-method="filterNode"
      v-bind="$attrs"
    >
      <template v-if="active" #default="{ node, data }">
        <div class="custom-tree-node">
          <span>{{ node.label }}</span>
          <div>
            <zk-button v-if="active.append" type="primary" link @click="append(data)">添加 </zk-button>
            <zk-button v-if="active.edit" type="primary" link @click="edit(data)" style="margin-left: 4px">
              修改
            </zk-button>
            <zk-button v-if="active.remove" type="danger" link @click="remove(node, data)" style="margin-left: 4px">
              删除
            </zk-button>
            <zk-button v-if="active.check" type="primary" link @click="viewNode(node, data)" style="margin-left: 4px">
              查看
            </zk-button>
          </div>
        </div>
      </template>
    </el-tree>
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

interface ZkTreeProps {
  data: TreeData
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

const emit = defineEmits(['view-node'])
const ElTreeRef = ref<TreeInstance>()
const dataSource = reactive<TreeData>(props.data)
const filterText = ref('')

const PROPS: Record<string, any> = {
  label: props.customProps.label,
  children: props.customProps.children,
  disabled: props.customProps.disabled,
  isLeaf: props.customProps.isLeaf,
  class: props.customProps.class,
}

watch(filterText, (val) => {
  ElTreeRef.value!.filter(val)
})

// 关键字搜索
const filterNode: FilterNodeMethodFunction = (value: string, data: any) => {
  if (!value) return true
  return data[PROPS.label].includes(value)
}
// 添加节点
const append = (data: Data) => {
  ElMessageBox.prompt('', '输入节点名称', {
    confirmButtonText: '添加',
    cancelButtonText: '取消',
    draggable: true,
  }).then(({ value }) => {
    const newChild = {
      id: Date.now(),
      [PROPS.label]: value,
      [PROPS.children]: [],
    }
    if (!data[PROPS.children]) {
      data[PROPS.children] = []
    }
    data[PROPS.children].push(newChild)
  })
}
// 删除节点
const remove = (node: Node, data: Data) => {
  const parent = node.parent
  const children: TreeData[] = parent?.data[PROPS.children] || parent?.data
  const index = children.findIndex((d) => d.id === data.id)
  children.splice(index, 1)
}
// 修改节点
const edit = (data: Data) => {
  ElMessageBox.prompt('', '输入节点名称', {
    confirmButtonText: '修改',
    cancelButtonText: '取消',
    draggable: true,
  }).then(({ value }) => {
    data[PROPS.label] = value
  })
}
const viewNode = (node: Node, data: Data) => {
  emit('view-node', node, data)
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
</style>
