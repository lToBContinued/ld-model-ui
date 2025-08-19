<template>
  <!-- 整个思维树容器；点空白处会取消选中 -->
  <div class="mindtree" ref="containerRef" @click.self="clearSelection">
    <!-- 视口：根据内容自适应宽高，出现滚动条 -->
    <div class="mindtree__viewport" :style="viewportStyle">
      <!-- 连线层：用 SVG 画父子节点之间的曲线 -->
      <svg class="mindtree__links" :width="svgSize.width" :height="svgSize.height">
        <path v-for="link in layout.links" :key="link.key" class="mindtree__link" :d="bezierPath(link)" fill="none" />
        <!-- :d="bezierPath(link)" 把两点坐标转成贝塞尔曲线路径 -->
      </svg>

      <!-- 节点层：每个节点绝对定位摆放 -->
      <div
        v-for="n in layout.nodes"
        :key="n.id"
        class="mindtree__node"
        :class="[
          { 'is-selected': n.id === selectedId },
          // 拖拽提示：显示“放到里面/前面/后面”的高亮样式
          dragOver &&
            dragOver.id === n.id &&
            (dragOver.where === 'inside' ? 'drop-inside' : dragOver.where === 'before' ? 'drop-before' : 'drop-after'),
        ]"
        :style="{ left: n.x + 'px', top: n.y + 'px', width: nodeWidth + 'px', height: nodeHeight + 'px' }"
        @click.stop="selectNode(n.id)"
        @dblclick.stop="externalEditor ? emitRequestEdit(n.id) : openEditor(n.id)"
        draggable="true"
        @dragstart="onDragStart(n.id)"
        @dragover.prevent="onDragOver($event, n.id)"
        @dragleave="onDragLeave(n.id)"
        @drop="onDrop($event, n.id)"
      >
        <!-- 默认节点内容；也支持外部用 slot 完全自定义 -->
        <slot
          name="node"
          :node="n.node"
          :selected="n.id === selectedId"
          :addChild="() => addChild(n.id)"
          :removeNode="() => removeNode(n.id)"
          :renameNode="(label: string) => renameNode(n.id, label)"
          :toggleCollapse="() => toggleCollapse(n.id)"
        >
          <div class="mindtree__node-inner">
            <div class="mindtree__node-header">
              <!-- 折叠/展开按钮 -->
              <button class="mindtree__btn" title="折叠/展开" @click.stop="toggleCollapse(n.id)">
                {{ n.node.collapsed ? '▶' : '▼' }}
              </button>

              <!-- 标签/编辑框切换：用 v-show 保持 DOM，不会反复卸载/挂载 -->
              <span
                :key="'view-' + n.id"
                v-show="editId !== n.id"
                class="mindtree__label"
                :title="n.node.label"
                @dblclick.stop="startEdit(n.id, n.node.label)"
                >{{ n.node.label }}</span
              >

              <!-- 内联重命名输入框：回车或失焦即提交 -->
              <input
                :key="'edit-' + n.id"
                v-show="editId === n.id"
                :ref="
                  (el) => {
                    if (n.id === editId) editInputEl = el as HTMLInputElement | null
                  }
                "
                class="mindtree__edit"
                v-model="editDraft"
                @keydown.enter.prevent="commitEdit()"
                @blur="commitEdit()"
              />
            </div>

            <!-- 简单的增删按钮；业务里可以用 slot 覆盖 -->
            <div class="mindtree__node-actions">
              <button class="mindtree__btn" title="新增子节点" @click.stop="addChild(n.id)">＋</button>
              <button
                class="mindtree__btn"
                title="删除本节点"
                :disabled="!canDelete(n.id)"
                @click.stop="removeNode(n.id)"
              >
                🗑
              </button>
            </div>
          </div>
        </slot>
      </div>
    </div>

    <!-- 内置编辑弹窗：当 externalEditor=false 时使用；否则走外部编辑器 -->
    <div v-if="!externalEditor && editor.visible" class="mindtree__modal-backdrop" @click.self="closeEditor">
      <div class="mindtree__modal" role="dialog" aria-modal="true">
        <div class="mindtree__modal-header">
          <strong>编辑节点</strong>
          <button class="mindtree__btn" @click="closeEditor">✕</button>
        </div>

        <!-- 弹窗内容也支持 slot 覆盖 -->
        <slot name="editor" :draft="editor.draft" :save="saveEditor" :close="closeEditor">
          <label class="mindtree__field">
            <span>名称</span>
            <input v-model="editor.draft.label" class="mindtree__input" />
          </label>
          <label class="mindtree__field">
            <span>备注</span>
            <textarea
              v-model="editor.draft.note"
              class="mindtree__textarea"
              rows="4"
              placeholder="随便写点补充信息……"
            ></textarea>
          </label>
          <div class="mindtree__modal-actions">
            <button class="mindtree__btn" @click="closeEditor">取消</button>
            <button class="mindtree__btn mindtree__btn-primary" @click="saveEditor">保存</button>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, watch, ref as vueRef } from 'vue'

/* ---------------- DOM 引用与尺寸 ---------------- */
const containerRef = vueRef<HTMLDivElement | null>(null)
const containerSize = vueRef<{ width: number; height: number }>({ width: 0, height: 0 })

/* ---------------- 类型定义 ---------------- */
export interface MindNode {
  id: string
  label: string
  children?: MindNode[]
  collapsed?: boolean
  [key: string]: any
}
interface PositionedNode {
  id: string
  x: number
  y: number
  depth: number
  node: MindNode
}
interface LinkItem {
  key: string
  x1: number
  y1: number
  x2: number
  y2: number
}

/* ---------------- Props & Emits ---------------- */
const props = defineProps<{
  modelValue: MindNode // 整棵树的根节点
  readonly?: boolean // 只读：不允许编辑/增删
  allowDeleteRoot?: boolean // 是否允许删除根
  nodeWidth?: number // 节点框宽
  nodeHeight?: number // 节点框高
  horizontalGap?: number // 节点间水平间距
  verticalGap?: number // 节点间垂直间距
  externalEditor?: boolean // 是否使用外部编辑器
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: MindNode): void
  (e: 'select', id: string | null): void
  (e: 'add', parentId: string, newNode: MindNode): void
  (e: 'remove', id: string): void
  (e: 'rename', id: string, label: string): void
  (e: 'toggle', id: string, collapsed: boolean): void
  (e: 'edit', id: string, node: MindNode): void
  (e: 'request-edit', id: string, node: MindNode): void
  (e: 'dnd', payload: { sourceId: string; targetId: string; where: 'before' | 'after' | 'inside' }): void
}>()

/* ---------------- 默认值（computed 便于响应式） ---------------- */
const nodeWidth = computed(() => props.nodeWidth ?? 160)
const nodeHeight = computed(() => props.nodeHeight ?? 48)
const hGap = computed(() => props.horizontalGap ?? 72)
const vGap = computed(() => props.verticalGap ?? 24)
const externalEditor = computed(() => !!props.externalEditor)

/* ---------------- 组件内状态 ---------------- */
// 用普通变量保存输入框元素引用，避免卸载时 ref 回调置空带来的竞态
let editInputEl: HTMLInputElement | null = null
const selectedId = vueRef<string | null>(null) // 当前选中的节点 id
const editId = vueRef<string | null>(null) // 正在内联编辑的节点 id
const editDraft = vueRef('') // 内联编辑草稿
const editor = vueRef<{ visible: boolean; id: string | null; draft: any }>({ visible: false, id: null, draft: {} })
const draggingId = vueRef<string | null>(null) // 正在拖拽的节点 id
const dragOver = vueRef<{ id: string; where: 'before' | 'after' | 'inside' } | null>(null) // 拖拽悬停位置信息

/* ---------------- 小工具 ---------------- */
const deepClone = <T,>(x: T): T => JSON.parse(JSON.stringify(x)) // 简单深拷贝（结构体友好）
const uuid = () =>
  globalThis.crypto?.randomUUID ? crypto.randomUUID() : `id_${Date.now()}_${Math.random().toString(36).slice(2)}`

/** 深度优先搜索某个 id，并返回节点和它的父节点 */
function findNodeAndParent(
  root: MindNode,
  id: string,
  parent: MindNode | null = null,
): { node: MindNode | null; parent: MindNode | null } {
  if (!root) return { node: null, parent: null }
  if (root.id === id) return { node: root, parent }
  const children = root.children ?? []
  for (const c of children) {
    const res = findNodeAndParent(c, id, root)
    if (res.node) return res
  }
  return { node: null, parent: null }
}

/* ---------------- 布局算法（简单自顶向下排版） ---------------- */
const layout = computed(() => {
  const nodes: PositionedNode[] = []
  const links: LinkItem[] = []
  let nextY = 0
  const leafStride = nodeHeight.value + vGap.value // 两个叶子之间的垂直步长

  // 折叠的节点不展示子节点
  const visibleChildren = (n: MindNode): MindNode[] => (n.children && !n.collapsed ? (n.children as MindNode[]) : [])

  /** 递归摆放：返回当前节点的 y，父节点用于居中 */
  function place(node: MindNode, depth: number): number {
    const kids = visibleChildren(node)
    const x = depth * (nodeWidth.value + hGap.value)
    if (kids.length === 0) {
      // 叶子：占一行
      const y = nextY
      nextY += leafStride
      nodes.push({ id: node.id, x, y, depth, node })
      return y
    }
    // 有孩子：先放孩子，取上下中点作为自己的 y（让父节点居中）
    const childYs = kids.map((k) => place(k, depth + 1))
    const y = Math.round((Math.min(...childYs) + Math.max(...childYs)) / 2)
    nodes.push({ id: node.id, x, y, depth, node })
    // 记录连线：父 → 子
    for (const k of kids) {
      const child = nodes.find((nn) => nn.id === k.id)!
      links.push({
        key: node.id + '→' + k.id,
        x1: x + nodeWidth.value,
        y1: y + nodeHeight.value / 2,
        x2: child.x,
        y2: child.y + nodeHeight.value / 2,
      })
    }
    return y
  }

  place(props.modelValue, 0)
  return { nodes, links }
})

/* ---------------- 画布尺寸与路径 ---------------- */
// SVG 画布尺寸：包住所有节点
const svgSize = computed(() => {
  const maxX = Math.max(...layout.value.nodes.map((n) => n.x + nodeWidth.value), nodeWidth.value)
  const maxY = Math.max(...layout.value.nodes.map((n) => n.y + nodeHeight.value), nodeHeight.value)
  return { width: maxX + 2, height: maxY + 2 }
})
// 视口尺寸：取内容和容器的较大值，避免剪裁
const viewportStyle = computed(() => ({
  width: Math.max(svgSize.value.width, containerSize.value.width) + 'px',
  height: Math.max(svgSize.value.height, containerSize.value.height) + 'px',
}))
// 把两点连成一条平滑的三次贝塞尔曲线
function bezierPath(link: LinkItem) {
  const dx = Math.max(24, Math.floor(hGap.value / 2))
  const { x1, y1, x2, y2 } = link
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`
}

/* ---------------- 基本交互：选中/编辑/增删 ---------------- */
function selectNode(id: string) {
  selectedId.value = id
  emit('select', id)
}
function clearSelection() {
  selectedId.value = null
  emit('select', null)
}
function startEdit(id: string, current: string) {
  if (props.readonly) return
  editId.value = id
  editDraft.value = current
  nextTick(() => editInputEl?.focus())
}
function commitEdit() {
  if (!editId.value) return
  const id = editId.value
  const newLabel = editDraft.value.trim() || '未命名'
  editId.value = null
  if (props.readonly) return
  const { node } = findNodeAndParent(props.modelValue, id)
  if (node && node.label === newLabel) return
  renameNode(id, newLabel)
}

function canDelete(id: string) {
  if (props.allowDeleteRoot) return true
  return props.modelValue.id !== id // 默认不允许删除根
}

// 安全修改树：拷贝一份，改完再 emit（保持“不可变数据”思路）
function updateTree(mutator: (root: MindNode) => void) {
  const copy = deepClone(props.modelValue)
  mutator(copy)
  emit('update:modelValue', copy)
}

function addChild(parentId: string) {
  if (props.readonly) return
  const newNode: MindNode = { id: uuid(), label: '新节点', children: [] }
  updateTree((root) => {
    const { node } = findNodeAndParent(root, parentId)
    if (!node) return
    node.children = node.children ?? []
    node.children.push(newNode)
    node.collapsed = false
  })
  emit('add', parentId, newNode) // 通知父组件：可以去调后端创建并替换临时 id
}

function removeNode(id: string, ev?: Event) {
  ev?.preventDefault()
  if (props.readonly) return
  if (!canDelete(id)) return
  emit('remove', id) // 只发事件让父组件确认（如弹窗/后端校验）
}

// 真正从本地树中删除一个节点（配合父组件确认后调用）
function removeNodeLocal(id: string) {
  updateTree((root) => {
    const { parent } = findNodeAndParent(root, id)
    if (!parent) return
    parent.children = (parent.children ?? []).filter((c) => c.id !== id)
  })
  if (selectedId.value === id) selectedId.value = null
}

function renameNode(id: string, label: string) {
  if (props.readonly) return
  updateTree((root) => {
    const { node } = findNodeAndParent(root, id)
    if (!node) return
    node.label = label
  })
  emit('rename', id, label)
}

function toggleCollapse(id: string) {
  updateTree((root) => {
    const { node } = findNodeAndParent(root, id)
    if (!node) return
    node.collapsed = !node.collapsed
  })
  const { node } = findNodeAndParent(props.modelValue, id)
  emit('toggle', id, !(node?.collapsed ?? false))
}

/* ---------------- 内置弹窗编辑 ---------------- */
function openEditor(id: string) {
  if (props.readonly) return
  const { node } = findNodeAndParent(props.modelValue, id)
  if (!node) return
  // 草稿用深拷贝，避免直接改原对象
  editor.value = { visible: true, id, draft: deepClone({ note: '', ...node }) }
}
function closeEditor() {
  editor.value.visible = false
  editor.value.id = null
}
function saveEditor() {
  if (!editor.value.id) return
  const id = editor.value.id
  const draft = deepClone(editor.value.draft)
  updateTree((root) => {
    const { node } = findNodeAndParent(root, id)
    if (!node) return
    const keepChildren = node.children // 避免覆盖 children
    Object.assign(node, draft)
    if (keepChildren && node.children !== keepChildren) node.children = keepChildren
  })
  emit('rename', id, draft.label) // 名称也当作一次“重命名”事件
  const { node } = findNodeAndParent(props.modelValue, id)
  emit('edit', id, node as MindNode) // 把修改后的节点回传给父组件
  closeEditor()
}

/* ---------------- 外置编辑支持（父组件控制弹窗） ---------------- */
function mergeNode(id: string, patch: Partial<MindNode>) {
  if (props.readonly) return
  const copy = deepClone(patch)
  updateTree((root) => {
    const { node } = findNodeAndParent(root, id)
    if (!node) return
    const keepChildren = node.children
    Object.assign(node, copy)
    if (keepChildren && node.children !== keepChildren) node.children = keepChildren
  })
  if (patch.label !== undefined) emit('rename', id, String(patch.label))
  const { node } = findNodeAndParent(props.modelValue, id)
  emit('edit', id, node as MindNode)
}
function emitRequestEdit(id: string) {
  const { node } = findNodeAndParent(props.modelValue, id)
  if (!node) return
  emit('request-edit', id, deepClone(node)) // 把当前节点数据交给外部编辑器
}

/* ---------------- 拖拽（只计算“放哪”并抛事件，真正移动由父组件处理） ---------------- */
function isDescendant(root: MindNode, ancestorId: string, maybeChildId: string): boolean {
  const { node: anc } = findNodeAndParent(root, ancestorId)
  if (!anc) return false
  function dfs(n: MindNode): boolean {
    if (!n.children) return false
    for (const c of n.children) {
      if (c.id === maybeChildId) return true
      if (dfs(c)) return true
    }
    return false
  }
  return dfs(anc)
}
function onDragStart(id: string) {
  draggingId.value = id
}
function onDragOver(e: DragEvent, targetId: string) {
  if (!draggingId.value || draggingId.value === targetId) return
  if (isDescendant(props.modelValue, draggingId.value, targetId)) return // 禁止把父拖到子里
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const y = e.clientY - rect.top
  const h = rect.height
  // 划分为三段：上 1/3=before，中 1/3=inside，下 1/3=after
  let where: 'before' | 'after' | 'inside'
  if (y < h / 3) where = 'before'
  else if (y > (h * 2) / 3) where = 'after'
  else where = 'inside'
  dragOver.value = { id: targetId, where }
}
function onDragLeave(targetId: string) {
  if (dragOver.value && dragOver.value.id === targetId) dragOver.value = null
}
function onDrop(e: DragEvent, targetId: string) {
  if (!draggingId.value || !dragOver.value) return
  const payload = { sourceId: draggingId.value, targetId, where: dragOver.value.where }
  draggingId.value = null
  dragOver.value = null
  emit('dnd', payload) // 交给父组件真的去“改树 + 调后端 + 回填”
}

/* ---------------- 对外暴露的方法（父组件可通过 ref 调用） ---------------- */
defineExpose({
  focusNode(id: string) {
    selectNode(id)
  },
  addChild,
  removeNode, // 仅发事件，请结合 removeNodeLocal 使用
  removeNodeLocal, // 真正从树里删
  renameNode,
  toggleCollapse,
  openEditor,
  mergeNode,
})

/* ---------------- 进入编辑自动聚焦输入框 ---------------- */
watch(editId, async (id) => {
  if (!id) return
  await nextTick()
  editInputEl?.focus()
})

/* ---------------- 初始化尺寸监听 + 键盘快捷键 ---------------- */
onMounted(() => {
  // 计算容器尺寸
  const resize = () => {
    const el = containerRef.value
    if (el) containerSize.value = { width: el.clientWidth, height: el.clientHeight }
  }
  resize()

  // ResizeObserver 更顺滑；不支持则退化到 window.resize
  const RO = (window as any).ResizeObserver
  if (RO) {
    const ro = new RO(() => resize())
    if (containerRef.value) ro.observe(containerRef.value)
  } else {
    window.addEventListener('resize', resize)
  }

  // 键盘快捷键：Enter 新增子节点、Delete 删除、F2 重命名、Esc 关弹窗
  /*window.addEventListener('keydown', (e) => {
    if (editor.value.visible) {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeEditor()
      }
      return
    }
    if (!selectedId.value || props.readonly) return
    if (e.key === 'Enter') {
      e.preventDefault()
      addChild(selectedId.value)
    } else if (e.key === 'Delete') {
      e.preventDefault()
      removeNode(selectedId.value)
    } else if (e.key.toLowerCase() === 'f2') {
      const { node } = findNodeAndParent(props.modelValue, selectedId.value)
      if (node) startEdit(node.id, node.label)
    }
  })*/
})
</script>

<style scoped>
/* 基本布局与配色（可按项目 UI 自行调整） */
.mindtree {
  position: relative;
  width: 100%;
  height: 100%;
  background: #fafafa;
  padding: 20px;
}
.mindtree__viewport {
  position: relative;
  overflow: auto;
}
.mindtree__links {
  position: absolute;
  inset: 0;
}
.mindtree__link {
  stroke: #c8c8d0;
  stroke-width: 2px;
}

/* 节点卡片 */
.mindtree__node {
  position: absolute;
  box-sizing: border-box;
}
.mindtree__node-inner {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 10px;
  border: 1px solid #d6d6e0;
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  padding: 6px 8px;
}
.mindtree__node.is-selected .mindtree__node-inner {
  border-color: #5b8cff;
  box-shadow: 0 0 0 2px rgba(91, 140, 255, 0.15);
}

/* 文本与输入 */
.mindtree__node-header {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 28px;
}
.mindtree__label {
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mindtree__edit {
  width: 100%;
  border: 1px solid #d0d0da;
  border-radius: 6px;
  padding: 2px 6px;
  font-size: 14px;
  position: relative;
  z-index: 1; /* 盖住按钮，避免“错位”感 */
}
.mindtree__node-inner {
  overflow: visible;
}

/* 操作按钮 */
.mindtree__node-actions {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
}
.mindtree__btn {
  border: none;
  background: #f2f4ff;
  padding: 2px 6px;
  border-radius: 6px;
  cursor: pointer;
}
.mindtree__btn-primary {
  background: #4c7dff;
  color: #fff;
}

/* 弹窗 */
.mindtree__modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: grid;
  place-items: center;
  z-index: 10;
}
.mindtree__modal {
  width: min(560px, calc(100vw - 32px));
  background: #fff;
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
}
.mindtree__modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.mindtree__field {
  display: grid;
  grid-template-columns: 72px 1fr;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
}
.mindtree__input,
.mindtree__textarea {
  width: 100%;
  border: 1px solid #d0d0da;
  border-radius: 8px;
  padding: 6px 8px;
  font-size: 14px;
}
.mindtree__modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}

/* 拖拽提示样式：inside/ before/ after 三种状态 */
.mindtree__node.drop-inside .mindtree__node-inner {
  outline: 2px dashed #4c7dff;
}
.mindtree__node.drop-before .mindtree__node-inner {
  box-shadow: inset 0 3px 0 #4c7dff;
}
.mindtree__node.drop-after .mindtree__node-inner {
  box-shadow: inset 0 -3px 0 #4c7dff;
}
</style>
