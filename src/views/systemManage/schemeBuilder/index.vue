<template>
  <div class="subtree-page">
    <!-- 左侧：子树列表（可筛选：所属体系 + 名称），分页 -->
    <aside class="left">
      <header class="left__top">
        <div class="row">
          <el-select v-model="filters.systemId" @change="reloadSubtrees" style="width: 150px">
            <el-option v-for="s in systems" :key="s.id" :label="s.name" :value="s.id">{{ s.name }}</el-option>
          </el-select>
          <!--<select class="select" v-model.number="filters.systemId" @change="reloadSubtrees" style="width: 150px">
            <option v-for="s in systems" :key="s.id" :label="s.name" :value="s.id">{{ s.name }}</option>
          </select>-->
          <el-input
            class="search"
            style="width: 100px"
            v-model.trim="filters.keyword"
            placeholder="按方案名称搜索…"
            @blur="reloadSubtrees"
          />
        </div>
        <div class="row">
          <el-button type="primary" @click="openCreateModal">新建子树</el-button>
          <el-button @click="reloadSubtrees" :disabled="loadingList">刷新</el-button>
        </div>
      </header>

      <section class="left__list">
        <div
          v-for="st in subtrees"
          :key="st.id"
          class="item"
          :class="{ active: currentSubtree && currentSubtree.id === st.id }"
          @click="selectSubtree(st)"
          @dblclick="openPlanEditor(st)"
        >
          <div class="item__main">
            <div class="title" :title="st.name">{{ st.name }}</div>
            <div class="desc" v-if="st.description">{{ st.description }}</div>
            <div class="meta">体系ID：{{ st.systemId }}</div>
          </div>
          <div class="item__ops">
            <button class="btn tiny" title="编辑方案" @click.stop="openPlanEditor(st)">✎</button>
            <button class="btn tiny danger" title="删除方案" @click.stop="onRequestDeletePlan(st)">🗑</button>
          </div>
        </div>

        <div v-if="!loadingList && subtrees.length === 0" class="empty">暂无数据</div>
        <div v-if="loadingList" class="empty">加载中…</div>
      </section>

      <footer class="left__pager">
        <span>第 {{ page }} / {{ pages }} 页，共 {{ total }} 条</span>
        <div class="pager">
          <button class="btn" :disabled="page <= 1 || loadingList" @click="goto(1)">«</button>
          <button class="btn" :disabled="page <= 1 || loadingList" @click="goto(page - 1)">上一页</button>
          <button class="btn" :disabled="page >= pages || loadingList" @click="goto(page + 1)">下一页</button>
          <button class="btn" :disabled="page >= pages || loadingList" @click="goto(pages)">»</button>
        </div>
      </footer>
    </aside>

    <!-- 右侧：构建区 -->
    <main class="right">
      <header class="right__top">
        <div class="title">
          <template v-if="currentSubtree">
            <span>{{ currentSubtree.name }}</span>
            <small v-if="currentSystemName" class="sys">（所属体系：{{ currentSystemName }}）</small>
          </template>
          <template v-else>请选择或新建一个子树方案</template>
        </div>
        <div class="actions" v-if="currentSubtree">
          <button class="btn" @click="openPlanEditor(currentSubtree)">编辑方案</button>
          <button class="btn" @click="reloadTree">刷新树</button>
        </div>
      </header>

      <!-- 没选方案 -->
      <section v-if="!currentSubtree" class="placeholder">
        <p>左侧选择一个方案（子树），或点击“新建子树”。</p>
      </section>

      <!-- 已选方案：树区域 -->
      <section v-else class="treewrap">
        <!-- 稳定滚动容器，避免滚动条闪动 -->
        <div class="tree-scroller" v-if="tree">
          <MindTree
            ref="treeRef"
            v-model="tree"
            :externalEditor="true"
            :nodeWidth="280"
            :nodeHeight="64"
            @remove="onRequestDeleteNode"
            @request-edit="openNodeEditor"
            @dnd="onDnd"
          >
            <!-- 自定义节点外观 -->
            <template #node="{ node, toggleCollapse }">
              <div class="mt__node-inner">
                <div class="mt__node-header">
                  <button class="btn tiny" title="折叠/展开" @click.stop="toggleCollapse()">
                    {{ node.collapsed ? '▶' : '▼' }}
                  </button>
                  <span class="mt__label" :title="node.label">{{ node.label }}</span>
                </div>
                <div class="mt__node-sub" v-if="node.note">{{ node.note }}</div>
                <div class="mt__node-actions">
                  <button
                    class="btn tiny"
                    title="新增子节点"
                    @click.stop="openIndicatorPicker(String(node.id), node.refId)"
                  >
                    ＋
                  </button>
                  <button
                    class="btn tiny"
                    title="编辑（公式/权重/参数）"
                    @click.stop="openNodeEditor(String(node.id), node)"
                  >
                    ✎
                  </button>
                  <button
                    class="btn tiny danger"
                    :disabled="!canDelete(String(node.id))"
                    title="删除本节点"
                    @click.stop="onRequestDeleteNode(String(node.id))"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </template>
          </MindTree>
        </div>

        <div v-else class="placeholder">该方案没有树数据，请刷新。</div>
      </section>
    </main>

    <!-- 节点删除确认 -->
    <ConfirmModal
      v-model:open="confirmOpen"
      :title="confirmTitle"
      :message="confirmMessage"
      :confirmText="'删除'"
      :cancelText="'取消'"
      :danger="true"
      @confirm="onConfirmDelete"
      @cancel="onCancelDelete"
    />

    <!-- 方案删除确认 -->
    <ConfirmModal
      v-model:open="planDelOpen"
      title="删除方案"
      :message="planDelMessage"
      :confirmText="'删除'"
      :cancelText="'取消'"
      :danger="true"
      @confirm="doDeletePlan"
    />

    <!-- 新建子树弹窗（选择所属体系 + 方案名 + 根指标=体系根） -->
    <teleport to="body">
      <div v-if="createOpen" class="dlg-mask" @click.self="createOpen = false">
        <div class="dlg" role="dialog" aria-modal="true">
          <header class="dlg__header">
            <strong>新建子树方案</strong>
            <button class="btn ghost" @click="createOpen = false">✕</button>
          </header>
          <div class="dlg__body">
            <label class="field">
              <span>所属体系</span>
              <select class="select" v-model.number="createForm.systemId" @change="onPickSystemForCreate">
                <option :value="0" disabled>请选择体系</option>
                <option v-for="s in systems" :key="s.id" :value="s.id">{{ s.name }}</option>
              </select>
            </label>
            <label class="field">
              <span>方案名称</span>
              <input class="input" v-model.trim="createForm.name" placeholder="给方案起个名字…" />
            </label>
            <label class="field">
              <span>描述</span>
              <textarea class="textarea" rows="3" v-model.trim="createForm.description"></textarea>
            </label>

            <label class="field">
              <span>根指标</span>
              <input class="input" :value="createRootIndicatorName" placeholder="请选择体系后自动填充" readonly />
              <small class="tip">根已固定为所选体系的根节点；后续通过“＋”逐层选择其子指标。</small>
            </label>

            <p v-if="createError" class="error">{{ createError }}</p>
          </div>
          <footer class="dlg__footer">
            <button class="btn" @click="createOpen = false">取消</button>
            <button class="btn primary" :disabled="!canSubmitCreate" @click="doCreateSubtree">创建</button>
          </footer>
        </div>
      </div>
    </teleport>

    <!-- 指标选择弹窗（用于父节点“＋”：只展示该父对应母树节点的直接子项） -->
    <teleport to="body">
      <div v-if="pickerOpen" class="ip-mask" @click.self="closePicker">
        <div class="ip-dlg" role="dialog" aria-modal="true">
          <header class="ip-header">
            <strong>选择指标</strong>
            <button class="btn ghost" @click="closePicker">✕</button>
          </header>

          <div class="ip-body">
            <div class="ip-search">
              <input class="search" v-model.trim="pickerKeyword" placeholder="输入关键字过滤…" />
            </div>

            <div class="ip-list">
              <div
                v-for="opt in filteredPickerItems"
                :key="opt.id"
                class="ip-item"
                :class="{ leaf: opt.isLeaf, disabled: isAlreadyUsed(opt.id) }"
                @dblclick="onPickIndicator(opt)"
                @click="pickerSel = opt"
              >
                <span class="ip-title" :title="opt.name">{{ opt.name }}</span>
                <span v-if="opt.isLeaf" class="ip-leaf">叶</span>
                <div class="ip-desc" v-if="opt.description">{{ opt.description }}</div>
              </div>
            </div>
          </div>

          <footer class="ip-footer">
            <button class="btn" @click="closePicker">取消</button>
            <button
              class="btn primary"
              :disabled="!pickerSel || isAlreadyUsed(pickerSel.id)"
              @click="onPickIndicator(pickerSel!)"
            >
              确定
            </button>
          </footer>
        </div>
      </div>
    </teleport>

    <!-- 节点编辑弹窗 -->
    <teleport to="body">
      <div v-if="editorOpen" class="edit-mask" @click.self="closeEditor">
        <div class="edit-dlg" role="dialog" aria-modal="true">
          <header class="dlg__header">
            <strong>编辑节点（公式 / 权重 / 参数）</strong>
            <button class="btn ghost" @click="closeEditor">✕</button>
          </header>
          <div class="dlg__body">
            <label class="field">
              <span>名称</span>
              <input class="input" :value="editorInfo.name" readonly />
            </label>
            <!-- 描述框：始终渲染，只是内容可能为空 -->
            <label class="field">
              <span>描述</span>
              <textarea class="textarea" rows="2" :value="editorInfo.description || ''" readonly />
            </label>

            <label class="field">
              <span>公式</span>
              <div class="formula-row">
                <!-- 左边给个只读预览（可选），也可以去掉只留按钮 -->
                <div class="formula-preview" :title="editorFormula || '未设置'">
                  {{ editorFormula || '未设置' }}
                </div>
                <!-- 右边是弹窗按钮；把当前公式传进去，确认后回写到 editorFormula -->
                <FormulaButton
                  v-if="currentSubtree"
                  :subtreeId="Number(currentSubtree.id)"
                  :value="editorFormula || ''"
                  :evaluateOnConfirm="false"
                  @confirm="onFormulaConfirm"
                />
              </div>
            </label>

            <!-- 权重：仅非根节点可编辑 -->
            <label class="field" v-if="!isEditingRoot">
              <span>权重</span>
              <input
                class="input"
                type="number"
                v-model.number="editorWeight"
                placeholder="可选：权重数值（默认 1，可大于 1）"
              />
            </label>

            <div class="divider"></div>

            <h4 class="sec-title">参数</h4>
            <SubtreeParamEditor v-if="editorNodeId" :node-id="Number(editorNodeId)" />
          </div>
          <footer class="dlg__footer">
            <button class="btn" @click="closeEditor">取消</button>
            <button class="btn primary" :disabled="savingEditor" @click="saveEditor">保存</button>
          </footer>
        </div>
      </div>
    </teleport>

    <!-- 方案编辑弹窗 -->
    <teleport to="body">
      <div v-if="planEditOpen" class="dlg-mask" @click.self="planEditOpen = false">
        <div class="dlg" role="dialog" aria-modal="true">
          <header class="dlg__header">
            <strong>编辑方案</strong>
            <button class="btn ghost" @click="planEditOpen = false">✕</button>
          </header>
          <div class="dlg__body">
            <label class="field">
              <span>方案名称</span>
              <input class="input" v-model.trim="planEditForm.name" />
            </label>
            <label class="field">
              <span>描述</span>
              <textarea class="textarea" rows="3" v-model.trim="planEditForm.description"></textarea>
            </label>
          </div>
          <footer class="dlg__footer">
            <button class="btn" @click="planEditOpen = false">取消</button>
            <button class="btn primary" :disabled="savingPlan" @click="savePlan">保存</button>
          </footer>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import MindTree, { type MindNode } from '@/components/MindTree/MindTree.vue'
import ConfirmModal from '@/components/ConfirmSysDeleteModal.vue'
import SubtreeParamEditor from '@/components/SubtreeParamEditor.vue'
import { getSystemsPage, type IndicatorSystem } from '@/api/systems.ts'
import {
  pageSubtrees,
  createSubtree,
  getSubtreeTree,
  addSubtreeNode,
  deleteSubtreeNode,
  updateSubtreeNode,
  reorderSubtreeNodes,
  moveSubtreeNode,
  updateSubtree, // ★ 新增
  deleteSubtree, // ★ 新增
  type CreateSubtreeDTO,
  type UpdateSubtreeNodeDTO,
} from '@/api/subtrees.ts'
import { getSystemTree, type IndicatorTreeVO } from '@/api/indicators.ts'
import { findNodeAndParent } from '@/utils/treeUtils.ts'
import FormulaButton from '@/components/FormulaButton.vue'

/* ========= 左侧：子树列表 ========= */
const systems = ref<IndicatorSystem[]>([])
const subtrees = ref<any[]>([])
const loadingList = ref(false)
const page = ref(1)
const size = ref(7)
const total = ref(0)
const pages = ref(1)
const filters = ref<{ systemId: number; keyword: string }>({ systemId: 0, keyword: '' })

function resetFilters() {
  filters.value = { systemId: 0, keyword: '' }
  reloadSubtrees()
}

async function loadSystems() {
  try {
    const resp = await getSystemsPage({ page: 1, size: 100 })
    let list: any[] = []
    if (Array.isArray(resp)) {
      list = resp
    } else if (Array.isArray(resp.list)) {
      list = resp.list
    } else if (Array.isArray(resp.items)) {
      list = resp.items
    } else {
      list = []
    }
    systems.value = [{ id: 0, name: '全部体系' }, ...list]
    // systems.value = list as IndicatorSystem[]
  } catch {
    systems.value = []
  }
}
async function loadSubtrees() {
  loadingList.value = true
  try {
    const resp: any = await pageSubtrees({
      page: page.value,
      size: size.value,
      systemId: filters.value.systemId || undefined,
      keyword: filters.value.keyword || undefined, // ★ 用 keyword
    })
    const recs = Array.isArray(resp?.records) ? resp.records : (resp?.list ?? [])
    subtrees.value = recs || []
    total.value = typeof resp?.total === 'number' ? resp.total : subtrees.value.length
    const ps = typeof resp?.size === 'number' ? resp.size : size.value
    pages.value = Math.max(1, Math.ceil(total.value / Math.max(1, ps)))
    if (page.value > pages.value) page.value = pages.value
  } finally {
    loadingList.value = false
  }
}
function reloadSubtrees() {
  page.value = 1
  loadSubtrees()
}
function goto(p: number) {
  if (p >= 1 && p <= pages.value && !loadingList.value) {
    page.value = p
    loadSubtrees()
  }
}

/* ========= 右侧：构建区 ========= */
const currentSubtree = ref<any | null>(null)
const currentSystemName = computed(() => {
  if (!currentSubtree.value) return ''
  const id = currentSubtree.value.systemId
  const s = systems.value.find((x) => x.id === id)
  return s?.name || ''
})

function selectSubtree(st: any) {
  currentSubtree.value = st
  loadTreeOf(st.id, st.systemId)
}

/* 树数据与母树缓存（用于限制可选项） */
const treeRef = ref<InstanceType<typeof MindTree> | null>(null)
const tree = ref<MindNode | null>(null)
const motherRoot = ref<IndicatorTreeVO | null>(null)

function toMindNode(vo: any, isRoot = false): MindNode {
  const usePlanName = isRoot && currentSubtree.value
  const usePlanDesc = isRoot && currentSubtree.value

  return {
    id: String(vo.id), // 子树节点 id
    label: usePlanName ? currentSubtree.value!.name : vo.name && vo.name.trim() ? vo.name : `#${vo.refIndicatorId}`,
    note: usePlanDesc ? currentSubtree.value!.description || '' : vo.description || '',
    refId: vo.refIndicatorId, // 母树节点 id（用于层级限制）
    formula: vo.formula || '',
    weight: vo.weight ?? null, // ★ 带上权重
    children: (vo.children || []).map((c: any) => toMindNode(c, false)),
  } as any
}
async function loadTreeOf(subtreeId: number, systemId: number) {
  try {
    const vo = await getSubtreeTree(subtreeId)
    tree.value = vo ? toMindNode(vo, true) : null
    motherRoot.value = await getSystemTree(systemId)
  } catch {
    tree.value = null
  }
}
function reloadTree() {
  if (currentSubtree.value) loadTreeOf(currentSubtree.value.id, currentSubtree.value.systemId)
}

/* ========= 新建子树 ========= */
const createOpen = ref(false)
const createError = ref<string | null>(null)
const createForm = ref<{ systemId: number; name: string; description?: string; rootRefIndicatorId: number | null }>({
  systemId: 0,
  name: '',
  description: '',
  rootRefIndicatorId: null,
})
const createRootIndicatorName = computed(() => {
  if (!createForm.value.rootRefIndicatorId || !motherRoot.value) return ''
  const found = findIndicatorById(motherRoot.value, createForm.value.rootRefIndicatorId)
  return found?.name || ''
})
function openCreateModal() {
  createForm.value = { systemId: 0, name: '', description: '', rootRefIndicatorId: null }
  createError.value = null
  createOpen.value = true
}
async function onPickSystemForCreate() {
  createForm.value.rootRefIndicatorId = null
  if (createForm.value.systemId) {
    const root = await getSystemTree(createForm.value.systemId)
    motherRoot.value = root || null
    createForm.value.rootRefIndicatorId = root ? root.id : null
  } else {
    motherRoot.value = null
  }
}
const canSubmitCreate = computed(
  () => !!(createForm.value.systemId && createForm.value.name && createForm.value.rootRefIndicatorId),
)
async function doCreateSubtree() {
  try {
    createError.value = null
    const dto: CreateSubtreeDTO = {
      systemId: createForm.value.systemId,
      name: createForm.value.name,
      description: createForm.value.description || null,
      rootRefIndicatorId: createForm.value.rootRefIndicatorId!,
    }
    const newId = await createSubtree(dto)
    createOpen.value = false
    await loadSubtrees()
    const st = subtrees.value.find((s) => s.id === newId)
    if (st) selectSubtree(st)
  } catch (e: any) {
    createError.value = e?.message || '创建失败'
  }
}

/* ========= 指标选择弹窗（受限于母树层级） ========= */
const pickerOpen = ref(false)
const pickerKeyword = ref('')
const pickerSel = ref<any | null>(null)
const pickerCtx = ref<{ parentNodeId: string | null; parentRefId: number | null } | null>(null)

function openIndicatorPicker(parentNodeId: string | null, parentRefId: number | null) {
  if (!currentSubtree.value) return
  if (parentNodeId === null && !createOpen.value) {
    if (!motherRoot.value && currentSubtree.value?.systemId) {
      getSystemTree(currentSubtree.value.systemId).then((r) => (motherRoot.value = r))
    }
  }
  pickerCtx.value = { parentNodeId, parentRefId }
  pickerKeyword.value = ''
  pickerSel.value = null
  pickerOpen.value = true
}
function closePicker() {
  pickerOpen.value = false
  pickerSel.value = null
}

const pickerItems = computed(() => {
  if (!motherRoot.value) return []
  const ctx = pickerCtx.value
  if (!ctx || ctx.parentNodeId === null) {
    return (motherRoot.value.children || []).map((n) => ({
      id: n.id,
      name: n.name,
      description: n.description || '',
      isLeaf: !n.children || n.children.length === 0,
    }))
  }
  const parentRefId = ctx.parentRefId!
  const motherParent = findIndicatorById(motherRoot.value, parentRefId)
  if (!motherParent) return []
  return (motherParent.children || []).map((n) => ({
    id: n.id,
    name: n.name,
    description: n.description || '',
    isLeaf: !n.children || n.children.length === 0,
  }))
})
const filteredPickerItems = computed(() => {
  const kw = (pickerKeyword.value || '').trim()
  if (!kw) return pickerItems.value
  return pickerItems.value.filter(
    (x) => (x.name && x.name.includes(kw)) || (x.description && x.description.includes(kw)),
  )
})
function isAlreadyUsed(refIndicatorId: number) {
  if (!tree.value) return false
  const ctx = pickerCtx.value
  if (!ctx) return false
  const parentId = ctx.parentNodeId
  if (!parentId) {
    const kids = tree.value.children || []
    return kids.some((k) => Number((k as any).refId) === refIndicatorId)
  }
  const p = findNodeAndParent(tree.value, parentId).node
  const kids = p?.children || []
  return kids.some((k) => Number((k as any).refId) === refIndicatorId)
}
async function onPickIndicator(opt: any) {
  if (!currentSubtree.value) return
  const stId = currentSubtree.value.id
  const ctx = pickerCtx.value
  try {
    if (!ctx || ctx.parentNodeId === null) {
      await addSubtreeNode(stId, { parentId: null, refIndicatorId: opt.id })
    } else {
      await addSubtreeNode(stId, { parentId: Number(ctx.parentNodeId), refIndicatorId: opt.id })
    }
    closePicker()
    reloadTree()
  } catch (e: any) {
    alert(e?.message || '新增失败')
  }
}

/* ========= 删除节点 ========= */
const confirmOpen = ref(false)
const confirmTitle = ref('删除确认')
const confirmMessage = ref('')
const confirmCtx = ref<{ nodeId: number } | null>(null)

function onRequestDeleteNode(id: string) {
  const found = tree.value ? findNodeAndParent(tree.value, id) : { node: null }
  const name = (found.node as any)?.label || id
  confirmCtx.value = { nodeId: Number(id) }
  confirmTitle.value = '删除确认'
  confirmMessage.value = `确定删除节点 <b>${name}</b> 及其所有子节点？该操作不可恢复。`
  confirmOpen.value = true
}
function onConfirmDelete() {
  if (!confirmCtx.value) return
  deleteSubtreeNode(confirmCtx.value.nodeId)
    .then(() => reloadTree())
    .catch((e: any) => alert(e?.message || '删除失败'))
    .finally(() => (confirmCtx.value = null))
}
function onCancelDelete() {
  confirmCtx.value = null
}
function canDelete(id: string) {
  if (!tree.value) return false
  return tree.value.id !== id
}

/* ========= DnD：同层排序 / 改父 ========= */
async function onDnd(ev: { sourceId: string; targetId: string; where: 'before' | 'after' | 'inside' }) {
  if (!currentSubtree.value || !tree.value) return
  const stId = currentSubtree.value.id
  const srcId = Number(ev.sourceId)
  const tgtId = Number(ev.targetId)

  const src = findNodeAndParent(tree.value, ev.sourceId)
  const tgt = findNodeAndParent(tree.value, ev.targetId)
  if (!src.node || !tgt.node) return

  try {
    if (ev.where === 'inside') {
      await moveSubtreeNode(srcId, { subtreeId: stId, newParentId: tgtId })
      await reloadTree()
      return
    }
    const targetParentId = tgt.parent ? Number(tgt.parent.id) : null
    await moveSubtreeNode(srcId, { subtreeId: stId, newParentId: targetParentId ?? null })
    await reloadTree()
    if (!tree.value) return
    const p = targetParentId ? findNodeAndParent(tree.value, String(targetParentId)).node : tree.value
    const ids = (p?.children || []).map((c) => Number(c.id)).filter((id) => id !== srcId)
    const idx = ids.indexOf(tgtId)
    const insertPos = ev.where === 'before' ? idx : idx + 1
    ids.splice(insertPos, 0, srcId)
    await reorderSubtreeNodes({ subtreeId: stId, parentId: targetParentId ?? null, children: ids })
    await reloadTree()
  } catch (e: any) {
    alert(e?.message || '操作失败')
    await reloadTree()
  }
}

/* ========= 节点编辑（公式 / 权重 / 参数） ========= */
const editorOpen = ref(false)
const editorNodeId = ref<string | null>(null)
const editorInfo = ref<{ name: string; description?: string }>({ name: '', description: '' })
const editorFormula = ref<string | null>('')
const editorWeight = ref<number | null>(null)
const isEditingRoot = ref(false)
const savingEditor = ref(false)

function openNodeEditor(id: string, node: any) {
  editorNodeId.value = id
  editorInfo.value = { name: node.label, description: node.note || '' }
  editorFormula.value = (node as any).formula || ''
  isEditingRoot.value = !!tree.value && String(tree.value.id) === String(id)
  editorWeight.value = isEditingRoot.value ? null : (node.weight ?? null)
  editorOpen.value = true
}
function closeEditor() {
  editorOpen.value = false
  editorNodeId.value = null
}
async function saveEditor() {
  if (!editorNodeId.value) return
  try {
    savingEditor.value = true
    const payload: UpdateSubtreeNodeDTO = {
      formula: editorFormula.value || null,
      weight: isEditingRoot.value ? null : (editorWeight.value ?? null),
    }
    await updateSubtreeNode(Number(editorNodeId.value), payload)
    // 同步前端
    treeRef.value?.mergeNode(editorNodeId.value, {
      formula: editorFormula.value,
      weight: isEditingRoot.value ? undefined : editorWeight.value,
    } as any)
    editorOpen.value = false
  } catch (e: any) {
    alert(e?.message || '保存失败')
  } finally {
    savingEditor.value = false
  }
}

/* ========= 方案编辑 / 删除 ========= */
const planEditOpen = ref(false)
const planEditId = ref<number | null>(null)
const planEditForm = ref<{ name: string; description: string }>({ name: '', description: '' })
const savingPlan = ref(false)

function openPlanEditor(st: any) {
  planEditId.value = st.id
  planEditForm.value = { name: st.name || '', description: st.description || '' }
  planEditOpen.value = true
}
async function savePlan() {
  if (!planEditId.value) return
  try {
    savingPlan.value = true
    await updateSubtree(planEditId.value, {
      name: planEditForm.value.name,
      description: planEditForm.value.description,
    })
    // 更新列表与当前方案
    const idx = subtrees.value.findIndex((x) => x.id === planEditId.value)
    if (idx >= 0) {
      subtrees.value[idx].name = planEditForm.value.name
      subtrees.value[idx].description = planEditForm.value.description
    }
    if (currentSubtree.value && currentSubtree.value.id === planEditId.value) {
      currentSubtree.value.name = planEditForm.value.name
      currentSubtree.value.description = planEditForm.value.description
      // 根节点标题/备注跟随方案名/描述
      if (tree.value) {
        treeRef.value?.mergeNode(String(tree.value.id), {
          label: planEditForm.value.name,
          note: planEditForm.value.description,
        } as any)
      }
    }
    planEditOpen.value = false
  } catch (e: any) {
    alert(e?.message || '保存失败')
  } finally {
    savingPlan.value = false
  }
}

/* 删除方案 */
const planDelOpen = ref(false)
const planDelMessage = ref('')
let planToDelete: any = null

function onRequestDeletePlan(st: any) {
  planToDelete = st
  planDelMessage.value = `确定删除方案 <b>${st.name}</b> ？该操作不可恢复。`
  planDelOpen.value = true
}
async function doDeletePlan() {
  if (!planToDelete) return
  try {
    await deleteSubtree(planToDelete.id)
    planDelOpen.value = false
    // 若删除的是当前方案，清空右侧
    if (currentSubtree.value && currentSubtree.value.id === planToDelete.id) {
      currentSubtree.value = null
      tree.value = null
    }
    planToDelete = null
    await loadSubtrees()
  } catch (e: any) {
    alert(e?.message || '删除失败')
  }
}

/* ========= 工具 ========= */
function findIndicatorById(root: IndicatorTreeVO, id: number): IndicatorTreeVO | null {
  if (!root) return null
  if (root.id === id) return root
  for (const c of root.children || []) {
    const f = findIndicatorById(c, id)
    if (f) return f
  }
  return null
}

async function onFormulaConfirm(f: string) {
  // 只更新本地编辑值，是否立刻保存仍走“保存”按钮统一提交
  editorFormula.value = f || ''
  if (editorNodeId.value) {
    try {
      await updateSubtreeNode(Number(editorNodeId.value), { formula: editorFormula.value || null })
      treeRef.value?.mergeNode(editorNodeId.value, { formula: editorFormula.value } as any)
    } catch (e: any) {
      alert(e?.message || '保存失败')
    }
  }
}

/* ========= 首次加载 ========= */
onMounted(async () => {
  await loadSystems()
  await loadSubtrees()
})
</script>

<style scoped>
.subtree-page {
  display: flex;
  height: 100vh;
  width: 100vw;
  background: #fafafa;
}

/* 左侧 */
.left {
  width: 340px;
  min-width: 300px;
  background: #fff;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
}
.left__top {
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.row {
  display: flex;
  gap: 8px;
  align-items: center;
}
.select {
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.search {
  flex: 1;
}
.btn {
  border: none;
  background: #f4f6ff;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
}
.btn.primary {
  background: #4c7dff;
  color: #fff;
}
.btn.ghost {
  background: #f7f7f7;
}
.btn.tiny {
  padding: 2px 6px;
  border-radius: 6px;
}
.btn.danger {
  background: #ffecec;
  color: #c0392b;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.left__list {
  flex: 1;
  overflow: auto;
  padding: 8px;
}
.item {
  display: flex;
  gap: 8px;
  padding: 8px;
  border: 1px solid #eee;
  border-radius: 10px;
  margin: 6px 0;
  cursor: pointer;
  align-items: flex-start;
}
.item.active {
  border-color: #4c7dff;
  box-shadow: 0 0 0 2px rgba(76, 125, 255, 0.12);
}
.item__main {
  flex: 1;
  min-width: 0;
}
.item__ops {
  display: flex;
  gap: 6px;
}
.title {
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.desc {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.meta {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}
.empty {
  color: #999;
  padding: 12px;
  text-align: center;
}

.left__pager {
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f0f0f0;
}
.pager {
  display: flex;
  gap: 6px;
}

/* 右侧 */
.right {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.right__top {
  height: 56px;
  padding: 0 12px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
}
.title {
  font-weight: 700;
}
.title .sys {
  font-weight: 400;
  color: #666;
  margin-left: 6px;
}
.placeholder {
  flex: 1;
  display: grid;
  place-items: center;
  color: #888;
}

/* 外层不滚动，避免与 MindTree 双滚动抖动 */
.treewrap {
  flex: 1;
  min-height: 0;
  padding: 12px;
}
.tree-scroller {
  height: 100%;
  overflow-y: auto;
  overflow-x: auto; /* 你现在的使用方式；若想更稳可改为 hidden */
  scrollbar-gutter: stable both-edges;
  overscroll-behavior: contain;
}

/* MindTree slot */
.mt__node-inner {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 10px;
  border: 1px solid #d6d6e0;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  padding: 6px 8px;
}
.mt__node-header {
  display: flex;
  gap: 6px;
  align-items: center;
  font-weight: 600;
}
.mt__label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}
.mt__node-sub {
  color: #666;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mt__node-actions {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
}

/* 通用弹窗 */
.dlg-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: grid;
  place-items: center;
  z-index: 2200;
}
.dlg {
  width: min(680px, calc(100vw - 40px));
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}
.dlg__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.dlg__body {
  padding: 6px 2px;
}
.field {
  display: grid;
  grid-template-columns: 92px 1fr;
  gap: 8px;
  align-items: center;
  margin: 10px 0;
}
.input,
.textarea {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 6px 8px;
}
.dlg__footer {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
.error {
  color: #c0392b;
  margin-top: 6px;
}
.tip {
  color: #999;
}

/* 指标选择弹窗（> 编辑弹窗） */
.ip-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: grid;
  place-items: center;
  z-index: 3000;
}
.ip-dlg {
  width: min(720px, calc(100vw - 40px));
  max-height: min(80vh, 800px);
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
}
.ip-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.ip-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
}
.ip-search .search {
  width: 100%;
}
.ip-list {
  flex: 1;
  overflow: auto;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 8px;
}
.ip-item {
  padding: 8px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  margin: 6px 0;
  cursor: pointer;
}
.ip-item.leaf .ip-leaf {
  margin-left: 6px;
  font-size: 12px;
  color: #888;
}
.ip-item.disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.ip-title {
  font-weight: 600;
}
.ip-desc {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
}
.ip-footer {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* 节点编辑弹窗（2600） */
.edit-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: grid;
  place-items: center;
  z-index: 2600;
}
.edit-dlg {
  width: min(900px, calc(100vw - 40px));
  max-height: min(90vh, 900px);
  overflow: auto;
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.22);
}
.sec-title {
  margin: 8px 0 4px;
}
.divider {
  height: 1px;
  background: #eee;
  margin: 10px 0;
}
.formula-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.formula-preview {
  flex: 1;
  min-height: 34px;
  padding: 6px 8px;
  background: #fafafa;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
