<script setup lang="ts">
import { ref, watch } from 'vue'
import { Tree, Tag, Tooltip } from 'ant-design-vue'
import Title from '@/components/InputFormula/components/Title.vue'
import { DownOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  title: { type: String, default: '标题' },
  isSearch: { type: Boolean, default: true },
  treeData: { type: Array, required: true, default: () => [] },
  fieldNames: {
    type: Object,
    default: () => ({ title: 'label', key: 'value', children: 'children' }),
  },
  onHandleReset: { type: Function, default: () => {} },
})

const emits = defineEmits(['handleExplain', 'handleSelectNode'])

const searchValue = ref<string>('')

// ⚠️ 用 ref 保存“原始树”，并监听 props.treeData 变化
const defaultTree = ref<any[]>(JSON.parse(JSON.stringify(props.treeData || [])))
const showTree = ref<any[]>(props.treeData as any[])

const expandedKeys = ref<any[]>(defaultTree.value.length > 0 ? [defaultTree.value[0]?.value] : [])
const selectedKeys = ref<string[]>([])
const autoExpandParent = ref<boolean>(false)

watch(
  () => props.treeData,
  (val: any[] = []) => {
    // props 更新时，同步默认树 & 显示树
    defaultTree.value = JSON.parse(JSON.stringify(val || []))
    showTree.value = JSON.parse(JSON.stringify(val || []))
    // 安全设置展开项
    expandedKeys.value =
      defaultTree.value.length > 0 && defaultTree.value[0]?.value !== undefined ? [defaultTree.value[0].value] : []
    selectedKeys.value = []
    autoExpandParent.value = false
  },
  { deep: true, immediate: true },
)

function searchAndFilter(data: any[], keyword: string) {
  return (data || []).filter((item: any) => {
    const labelMatches = (item.label || '').toUpperCase().includes(keyword.toUpperCase())
    if (item.children && item.children.length > 0) {
      item.children = searchAndFilter(item.children, keyword)
    }
    return labelMatches || (item.children && item.children.length > 0)
  })
}

const filterNodesWithChildren = (data: any[]): any[] => {
  const result: any[] = []
  ;(data || []).forEach((node: any) => {
    if (node.children && node.children.length > 0) {
      result.push(node.value)
      result.push(...filterNodesWithChildren(node.children))
    }
  })
  return result
}

const handleSelect = (_: any, e: any) => {
  if (e.node.children && e.node.children.length > 0) {
    selectedKeys.value = []
  }
  if (e.node.explain && e.node.explain.length > 0) {
    emits('handleExplain', e.node.explain)
  }
}

const handleDbSelect = (node: any) => {
  // 支持非叶子节点也能选中插入
  emits('handleSelectNode', node)
}

const handleSearch = (text: string) => {
  searchValue.value = text
  if (!text) {
    // 空关键词：恢复原始树
    showTree.value = JSON.parse(JSON.stringify(defaultTree.value || []))
    expandedKeys.value =
      defaultTree.value.length > 0 && defaultTree.value[0]?.value !== undefined ? [defaultTree.value[0].value] : []
    autoExpandParent.value = false
    selectedKeys.value = []
  } else {
    const filterData = searchAndFilter(JSON.parse(JSON.stringify(defaultTree.value || [])), text)
    expandedKeys.value = filterNodesWithChildren(filterData)
    showTree.value = filterData
    autoExpandParent.value = true
  }
}

const onExpand = (keys: any[]): void => {
  expandedKeys.value = keys
  autoExpandParent.value = false
}

const showToolTip = (e: any) => {
  if (e.target.clientWidth >= e.target.scrollWidth) {
    e.target.style.pointerEvents = 'none'
  }
}

// 重置
const resetTree = () => {
  searchValue.value = ''
  showTree.value = JSON.parse(JSON.stringify(defaultTree.value || []))
  expandedKeys.value =
    defaultTree.value.length > 0 && defaultTree.value[0]?.value !== undefined ? [defaultTree.value[0].value] : []
  autoExpandParent.value = false
  selectedKeys.value = []

  // 可选：重置解释区域
  // if (typeof props.onHandleReset === 'function') props.onHandleReset()
}
</script>

<template>
  <div class="tree-content">
    <!-- 固定标题部分 -->
    <div class="tree-title-container">
      <Title
        v-bind="{
          title: props.title,
          isSearch: props.isSearch,
          showReset: true,
        }"
        @handleSearch="handleSearch"
        @handleReset="resetTree"
      />
    </div>

    <!-- 可滚动树部分 -->
    <div class="tree-scroll-container">
      <Tree
        v-if="showTree.length > 0"
        v-model:expandedKeys="expandedKeys"
        v-model:selectedKeys="selectedKeys"
        :autoExpandParent="autoExpandParent"
        show-line
        :tree-data="showTree"
        :fieldNames="props.fieldNames"
        style="height: auto"
        @select="handleSelect"
        @expand="onExpand"
      >
        <template #switcherIcon="{ switcherCls }">
          <down-outlined :class="switcherCls" />
        </template>

        <template #title="treeNode">
          <span class="tree-text" @dblclick="handleDbSelect(treeNode)">
            <Tooltip placement="top" @mouseenter="showToolTip">
              <template #title>
                <span>{{ treeNode[props.fieldNames.title] }}</span>
              </template>
              <span class="text">
                {{ treeNode[props.fieldNames.title] }}
              </span>
            </Tooltip>
            <Tag :bordered="false">{{ treeNode.tagName }}</Tag>
          </span>
        </template>
      </Tree>

      <div v-else class="empty">暂无数据</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tree-content {
  overflow: hidden;
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;

  .tree-title-container {
    position: sticky;
    z-index: 1;
    top: 0;

    flex-shrink: 0;

    background: white;
  }

  .tree-scroll-container {
    overflow: auto;
    flex-grow: 1;
    width: 100%;
    min-height: 0;
  }

  :deep(.ant-tree) {
    width: max-content;
    min-width: 100%;
    min-height: 100%;
  }

  :deep(.ant-tree-treenode) {
    width: auto;
    white-space: nowrap;
  }

  :deep(.ant-tree-node-content-wrapper) {
    .tree-text {
      display: flex;
      align-items: center;
      justify-content: space-between;

      width: 100%;
      padding: 0;

      .text {
        overflow: visible;
        text-overflow: unset;
        word-break: keep-all;
        white-space: nowrap;
      }

      .ant-tag {
        margin-left: 10px;
      }
    }
  }

  :deep(.ant-tree-switcher-line-icon) {
    display: none !important;
  }

  :deep(.ant-tree-switcher) {
    display: flex !important;
    align-items: center;
    justify-content: center;
  }

  .empty {
    padding: 8px 10px;
    color: #999;
  }
}

:deep(.ant-btn) {
  margin-left: 8px;
}
</style>
