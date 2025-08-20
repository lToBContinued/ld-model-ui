<template>
  <div class="page">
    <IndicatorSystemSidebar
      class="sidebar"
      @select="onSelectSystem"
      @created="onCreated"
      @deleted="onDeleted"
      @error="notify"
      @request-delete-system="onRequestDeleteSystem"
      @request-create-system="onRequestCreateSystem"
      @request-edit-system="onRequestEditSystem"
      ref="sidebarRef"
    />

    <!-- 统一系统弹窗（创建/编辑） -->
    <SystemModal
      v-model:open="systemModalOpen"
      :mode="systemModalMode"
      :model="systemModalModel"
      :error="systemModalError"
      @save="onSystemModalSave"
      @cancel="onSystemModalCancel"
    />

    <main class="main">
      <header class="main__top">
        <div class="title">
          <span v-if="currentSystem">{{ currentSystem.name }}</span>
          <span v-else>请选择指标体系</span>
        </div>
        <div class="actions">
          <button class="btn" @click="reloadTree" :disabled="!currentSystem">刷新树</button>
          <button class="btn" @click="copySelectedNode" :disabled="!currentSystem || !selectedNodeId">
            复制选中节点
          </button>
          <button class="btn" @click="cloneCurrentSystem" :disabled="!currentSystem">克隆该体系</button>
        </div>
      </header>

      <!-- 无体系 -->
      <section v-if="!currentSystem" class="placeholder">
        <p>左侧选择一个指标体系</p>
      </section>

      <!-- 有体系但还没有任何节点：创建根节点 -->
      <section v-else-if="!tree" class="create-root">
        <div class="card">
          <h3>创建根节点</h3>
          <label class="field">
            <span>名称</span>
            <input v-model.trim="rootForm.name" class="input" placeholder="例如：指标体系构建" />
          </label>
          <label class="field">
            <span>描述</span>
            <textarea v-model.trim="rootForm.description" class="textarea" rows="3" />
          </label>
          <div class="row">
            <button class="btn" @click="createRoot" :disabled="!rootForm.name">创建</button>
          </div>
        </div>
      </section>

      <!-- 展示并可编辑树 -->
      <section v-else class="treewrap">
        <MindTree
          ref="treeRef"
          v-model="tree"
          :externalEditor="true"
          @add="onAdd"
          @rename="onRename"
          @remove="onRequestDeleteNode"
          @request-edit="openNodeEditor"
          @select="onSelectNode"
          @dnd="onDnd"
          :nodeWidth="260"
          :nodeHeight="56"
        />
      </section>
    </main>

    <!-- 全局删除确认弹窗 -->
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

    <!--    这个是不能改的公式和权重的，只能修改名字和描述-->
    <NodeEditorModal v-model:open="editorOpen" :draft="editorDraft" title="编辑节点（名称与描述）" @save="onEditorSave">
      <template #body="{ local }">
        <label class="nem-field">
          <span>名称</span>
          <input v-model="local.name" class="nem-input" />
        </label>
        <label class="nem-field">
          <span>描述</span>
          <textarea v-model="local.description" class="nem-textarea" rows="3"></textarea>
        </label>
        <!-- 公式/权重不再出现在这个弹窗 -->
      </template>
    </NodeEditorModal>

    <!-- 外置节点编辑弹窗（名称/描述/公式/权重） 这个是可以改权重的 -->
    <!--    <NodeEditorModal v-model:open="editorOpen" :draft="editorDraft" @save="onEditorSave">-->
    <!--      <template #body="{ local }">-->
    <!--        <label class="nem-field">-->
    <!--          <span>名称</span>-->
    <!--          <input v-model="local.name" class="nem-input" />-->
    <!--        </label>-->
    <!--        <label class="nem-field">-->
    <!--          <span>描述</span>-->
    <!--          <textarea v-model="local.description" class="nem-textarea" rows="3"></textarea>-->
    <!--        </label>-->
    <!--        <label class="nem-field">-->
    <!--          <span>公式</span>-->
    <!--          <textarea v-model="local.formula" class="nem-textarea" rows="4" placeholder="可选，支持任意字符串表达式"></textarea>-->
    <!--        </label>-->
    <!--        <label class="nem-field">-->
    <!--          <span>权重</span>-->
    <!--          <input v-model.number="local.weightToParent" type="number" step="0.000001" class="nem-input" placeholder="0~1，可留空"/>-->
    <!--        </label>-->
    <!--      </template>-->
    <!--    </NodeEditorModal>-->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import IndicatorSystemSidebar from '@/components/IndicatorSystemSidebar.vue'
import MindTree, { type MindNode } from '@/components/MindTree/MindTree.vue'
import NodeEditorModal from '@/components/MindTree/NodeEditorModal.vue'
import ConfirmModal from '@/components/ConfirmSysDeleteModal.vue'
import SystemModal from '@/components/NewSystemModal.vue'
import type { IndicatorSystem } from '@/api/systems.ts'
//带有公式和权重的弹窗用这个
// import {
//   getSystemTree,
//   createIndicator,
//   updateIndicator,
//   deleteIndicator,
//   reorderChildren,
//   moveIndicator,
//   type IndicatorTreeVO,
//   type UpdateIndicatorDTO,
// } from "@/api/indicators";
//只有公式和描述的弹窗放这里
import {
  getSystemTree,
  createIndicator,
  deleteIndicator,
  reorderChildren,
  moveIndicator,
  type IndicatorTreeVO,
  updateIndicatorBasic, // ← 新增
  type UpdateIndicatorBasicDTO,
} from '@/api/indicators.ts'
import { createSystem, updateSystem, deleteSystem } from '@/api/systems.ts'
import { replaceNodeId, findNodeAndParent } from '@/utils/treeUtils.ts'

/* refs */
const sidebarRef = ref<InstanceType<typeof IndicatorSystemSidebar> | null>(null)
const treeRef = ref<InstanceType<typeof MindTree> | null>(null)

/* state */
const currentSystem = ref<IndicatorSystem | null>(null)
const tree = ref<MindNode | null>(null)
const systemModalError = ref<string | null>(null)

/* root form */
const rootForm = ref<{ name: string; description?: string }>({ name: '', description: '' })

/* editor modal */
const editorOpen = ref(false)
const editorId = ref<string | null>(null)
const editorDraft = ref<any>({})

/* 删除确认上下文 */
const confirmOpen = ref(false)
const confirmTitle = ref('删除确认')
const confirmMessage = ref('')
const confirmCtx = ref<{ type: 'system' | 'node'; id: number; name?: string } | null>(null)

/* 新建/编辑体系弹窗状态 */
const systemModalOpen = ref(false)
const systemModalMode = ref<'create' | 'edit'>('create')
const systemModalModel = ref<{ id?: number; name?: string; description?: string | null }>({ name: '', description: '' })

/* 克隆 */
import { cloneSystem } from '@/api/systems.ts'
import { duplicateIndicator } from '@/api/indicators.ts'

/* helpers */
function notify(msg: string) {
  alert(msg)
}
function toMindNode(vo: IndicatorTreeVO): MindNode {
  return {
    id: String(vo.id),
    label: vo.name,
    note: vo.description,
    formula: vo.formula,
    weight: vo.weightToParent,
    children: (vo.children || []).map(toMindNode),
  } as any
}

/* load */
function onSelectSystem(sys: IndicatorSystem | null) {
  currentSystem.value = sys
  tree.value = null
  if (sys) loadTree(sys.id)
}
async function loadTree(systemId: number) {
  try {
    const vo = await getSystemTree(systemId)
    tree.value = vo ? toMindNode(vo) : null
  } catch (e: any) {
    notify(e.message || String(e))
  }
}
function reloadTree() {
  if (currentSystem.value) loadTree(currentSystem.value.id)
}
function onCreated(_id: number) {
  /* 可 toast */
}
function onDeleted(id: number) {
  if (currentSystem.value?.id === id) {
    currentSystem.value = null
    tree.value = null
  }
}

/* create root */
async function createRoot() {
  if (!currentSystem.value) return
  try {
    await createIndicator({
      systemId: currentSystem.value.id,
      parentId: null,
      name: rootForm.value.name,
      description: rootForm.value.description || null,
    })
    rootForm.value = { name: '', description: '' }
    reloadTree()
  } catch (e: any) {
    notify(e.message || String(e))
  }
}

/* MindTree events → 持久化 */
async function onAdd(parentId: string, newNode: MindNode) {
  if (!currentSystem.value || !tree.value) return
  try {
    const serverId = await createIndicator({
      systemId: currentSystem.value.id,
      parentId: Number(parentId),
      name: newNode.label || '新节点',
      description: newNode.note || null,
      formula: (newNode as any).formula || null,
      weightToParent: (newNode as any).weight ?? null,
    })
    replaceNodeId(tree.value, newNode.id, serverId)
  } catch (e: any) {
    notify(e.message || String(e))
    reloadTree()
  }
}

async function onRemove(id: string) {
  if (!currentSystem.value) return
  try {
    await deleteIndicator(Number(id), currentSystem.value.id)
    await reloadTree()
  } catch (e: any) {
    notify(e.message || String(e))
    reloadTree()
  }
}
//有弹窗和公式的
// async function onRename(id: string, label: string) {
//   if (!currentSystem.value) return;
//
//   // 1) 前端先做同层重名校验，命中就不发请求
//   if (siblingNameConflict(id, label)) {
//     notify("同一父节点下已存在该名称");
//     reloadTree(); // 回滚本地的“乐观更新”
//     return;
//   }
//
//   try {
//     const payload: UpdateIndicatorDTO = { systemId: currentSystem.value.id, name: label };
//     await updateIndicator(Number(id), payload);
//   } catch (e: any) {
//     notify(e.message || "重命名失败");
//     reloadTree(); // 还原前端改动
//   }
// }

//无弹窗和公式的
async function onRename(id: string, label: string) {
  if (!currentSystem.value || !tree.value) return

  const trimmed = (label || '').trim() || '未命名'

  // 前端同层预校验（可留着，能减少后端 400）
  if (siblingNameConflict(id, trimmed)) {
    notify('同一父节点下已存在该名称')
    reloadTree() // 回滚本地乐观更新
    return
  }

  try {
    await updateIndicatorBasic(Number(id), { systemId: currentSystem.value.id, name: trimmed })
  } catch (e: any) {
    notify(e.message || '重命名失败')
    reloadTree() // 回滚
  }
}

/* 外置编辑器 */
//有权重和公式的弹窗
// function openNodeEditor(id: string, node: any) {
//   editorId.value = id;
//   editorDraft.value = {
//     name: node.label,
//     description: node.note || "",
//     formula: node.formula || "",
//     weightToParent: node.weight ?? null,
//   };
//   editorOpen.value = true;
// }
//无权重和公式的弹窗
function openNodeEditor(id: string, node: any) {
  editorId.value = id
  editorDraft.value = {
    name: node.label,
    description: node.note || '',
  }
  editorOpen.value = true
}
//有权重和公式的弹窗
// async function onEditorSave(draft: any) {
//   if (!currentSystem.value || !editorId.value) return;
//
//   // 先校验：同层重名不允许
//   if (siblingNameConflict(editorId.value, draft.name)) {
//     notify("同一父节点下已存在该名称");
//     return; // 不关闭弹窗，留在表单里让用户改
//   }
//   try {
//     await updateIndicator(Number(editorId.value), {
//       systemId: currentSystem.value.id,
//       name: draft.name,
//       description: draft.description || null,
//       formula: draft.formula || null,
//       weightToParent: draft.weightToParent ?? null,
//     });
//     treeRef.value?.mergeNode(editorId.value, {
//       label: draft.name,
//       note: draft.description,
//       formula: draft.formula,
//       weight: draft.weightToParent,
//     } as any);
//     editorOpen.value = false;
//   } catch (e: any) { notify(e.message || "保存失败"); }
// }

//无权重和公式的弹窗
async function onEditorSave(draft: any) {
  if (!currentSystem.value || !editorId.value) return

  // 同层重名预校验（保留你之前写过的 siblingNameConflict，如果还没加，参照我上一条消息）
  if (siblingNameConflict(editorId.value, draft.name)) {
    notify('同一父节点下已存在该名称')
    return
  }

  try {
    await updateIndicatorBasic(Number(editorId.value), {
      systemId: currentSystem.value.id,
      name: draft.name,
      description: draft.description ?? null,
    } as UpdateIndicatorBasicDTO)

    // 仅合并名称/描述
    treeRef.value?.mergeNode(editorId.value, {
      label: draft.name,
      note: draft.description,
    } as any)

    editorOpen.value = false
  } catch (e: any) {
    notify(e.message || '保存失败')
  }
}

/* 拖拽：同层排序 / 改父 */
async function onDnd(ev: { sourceId: string; targetId: string; where: 'before' | 'after' | 'inside' }) {
  if (!currentSystem.value || !tree.value) return
  const sysId = currentSystem.value.id
  const srcId = Number(ev.sourceId)
  const tgtId = Number(ev.targetId)

  const src = findNodeAndParent(tree.value, ev.sourceId)
  const tgt = findNodeAndParent(tree.value, ev.targetId)
  if (!src.node || !tgt.node) return

  try {
    if (ev.where === 'inside') {
      // 改父：移动到目标为父，默认排到最后
      await moveIndicator(srcId, { systemId: sysId, newParentId: tgtId })
      await reloadTree()
      return
    }

    // 计算 “目标父” = 目标的父
    const targetParentId = tgt.parent ? Number(tgt.parent.id) : null

    // 1) 先把源节点移到“目标父”（若本就同父，这一步也安全）
    await moveIndicator(srcId, { systemId: sysId, newParentId: targetParentId ?? null })

    // 2) 拿到该父下的所有孩子 id，按 before/after 重排
    await reloadTree() // 简单做法：刷新一次拿到最新顺序
    if (!tree.value) return
    const p = targetParentId ? findNodeAndParent(tree.value, String(targetParentId)).node : tree.value
    if (!p) return
    const ids = (p.children || []).map((c) => Number(c.id)).filter((id) => id !== srcId)
    const idx = ids.indexOf(tgtId)
    const insertPos = ev.where === 'before' ? idx : idx + 1
    ids.splice(insertPos, 0, srcId)

    await reorderChildren({
      systemId: sysId,
      parentId: targetParentId ?? null,
      children: ids,
    })

    await reloadTree()
  } catch (e: any) {
    notify(e.message || String(e))
    await reloadTree()
  }
}

/* 删除弹窗（系统 & 节点） */
function openConfirm(
  ctx: { type: 'system' | 'node'; id: number; name?: string },
  messageHtml: string,
  title = '删除确认',
) {
  confirmCtx.value = ctx
  confirmTitle.value = title
  confirmMessage.value = messageHtml
  confirmOpen.value = true
}
function onConfirmDelete() {
  if (!confirmCtx.value) return
  const ctx = confirmCtx.value
  confirmOpen.value = false

  if (ctx.type === 'system') {
    handleDeleteSystem(ctx.id)
  } else if (ctx.type === 'node') {
    handleDeleteNode(ctx.id)
  }
}
function onCancelDelete() {
  confirmCtx.value = null
}

async function handleDeleteSystem(id: number) {
  try {
    await deleteSystem(id)
    if (currentSystem.value?.id === id) {
      currentSystem.value = null
      tree.value = null
    }
    ;(sidebarRef.value as any)?.refresh?.()
  } catch (e: any) {
    notify(e.message || String(e))
  }
}

function onRequestDeleteSystem(sys: IndicatorSystem) {
  openConfirm(
    { type: 'system', id: sys.id, name: sys.name },
    `确认删除 <b>${sys.name}</b>？该体系下的所有指标都会被删除（不可恢复）。`,
  )
}

function onRequestDeleteNode(id: string) {
  if (!tree.value) return
  const found = findNodeAndParent(tree.value, id)
  const name = (found.node as any)?.label || id
  openConfirm({ type: 'node', id: Number(id), name }, `确认删除节点 <b>${name}</b> 及其所有子节点？该操作不可恢复。`)
}

async function handleDeleteNode(id: number) {
  if (!currentSystem.value) return
  try {
    await deleteIndicator(id, currentSystem.value.id)
    await reloadTree()
  } catch (e: any) {
    notify(e.message || String(e))
  }
}

/* 新建/编辑体系弹窗 */
function onRequestCreateSystem() {
  systemModalMode.value = 'create'
  systemModalModel.value = { name: '', description: '' }
  systemModalError.value = null
  systemModalOpen.value = true
}
function onRequestEditSystem(sys: IndicatorSystem) {
  systemModalMode.value = 'edit'
  systemModalModel.value = { id: sys.id, name: sys.name, description: sys.description ?? '' }
  systemModalError.value = null
  systemModalOpen.value = true
}
function onSystemModalCancel() {
  systemModalOpen.value = false
}
async function onSystemModalSave(payload: {
  id?: number
  name: string
  description?: string | null
  mode: 'create' | 'edit'
}) {
  try {
    systemModalError.value = null
    if (payload.mode === 'create') {
      const newId = await createSystem({ name: payload.name, description: payload.description ?? '' })
      await (sidebarRef.value as any)?.refresh?.()
      ;(sidebarRef.value as any)?.selectById?.(newId)
      if (!currentSystem.value || currentSystem.value.id !== newId) {
        onSelectSystem({ id: newId, name: payload.name, description: payload.description ?? '' } as IndicatorSystem)
      }
      systemModalOpen.value = false
    } else {
      if (!payload.id) return
      await updateSystem(payload.id, { name: payload.name, description: payload.description ?? '' })
      await (sidebarRef.value as any)?.refresh?.()
      if (currentSystem.value && currentSystem.value.id === payload.id) {
        currentSystem.value = { ...currentSystem.value, name: payload.name, description: payload.description ?? '' }
      }
      systemModalOpen.value = false
    }
  } catch (e: any) {
    // 不关弹窗，把错误展示出来（例如：名称已存在）
    systemModalError.value = e?.message || '保存失败'
  }
}

//解决报错400问题
function siblingNameConflict(nodeId: string, newLabel: string): boolean {
  if (!tree.value) return false
  const { parent } = findNodeAndParent(tree.value, nodeId)
  // 根节点没有兄弟，直接不冲突
  if (!parent) return false

  const siblings = parent.children || []
  const target = (newLabel || '').trim()
  return siblings.some((n) => n.id !== nodeId && String(n.label || '').trim() === target)
}

// 选中节点 id
const selectedNodeId = ref<string | null>(null)
function onSelectNode(id: string | null) {
  selectedNodeId.value = id
}

// 复制选中节点（整棵）到“同父”末尾
async function copySelectedNode() {
  if (!currentSystem.value || !tree.value || !selectedNodeId.value) return
  const found = findNodeAndParent(tree.value, selectedNodeId.value)
  if (!found.node) return

  const parentId = found.parent ? Number(found.parent.id) : null
  const name = (found.node.label || '').trim()
  try {
    await duplicateIndicator(Number(found.node.id), {
      targetSystemId: currentSystem.value.id,
      newParentId: parentId,
      deep: true,
      nameOverride: name ? name + ' 副本' : undefined,
    })
    await reloadTree()
    alert('复制成功')
  } catch (e: any) {
    notify(e.message || '复制失败')
  }
}

// 克隆当前体系为新体系（简单用 prompt 获取新名称）
async function cloneCurrentSystem() {
  if (!currentSystem.value) return
  const newName = window.prompt('新体系名称：', currentSystem.value.name + '（副本）')
  if (!newName) return
  try {
    const newId = await cloneSystem({
      sourceSystemId: currentSystem.value.id,
      name: newName.trim(),
      description: currentSystem.value.description ?? '',
    })
    // 刷新左侧并选中
    await (sidebarRef.value as any)?.refresh?.()
    ;(sidebarRef.value as any)?.selectById?.(newId)
    onSelectSystem({ id: newId, name: newName.trim(), description: currentSystem.value.description ?? '' } as any)
    alert('体系已克隆')
  } catch (e: any) {
    notify(e.message || '克隆失败')
  }
}
</script>

<style scoped>
.page {
  display: flex;
  width: 100vw;
  height: 100vh;
  background: #fafafa;
}

.sidebar {
  flex: 0 0 320px;
}

.main {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.main__top {
  display: flex;
  align-items: center;
  justify-content: space-between;

  height: 56px;
  padding: 0 12px;

  background: #fff;
  border-bottom: 1px solid #eee;
}

.title {
  font-weight: 700;
}

.actions .btn {
  cursor: pointer;

  padding: 6px 10px;

  background: #f4f6ff;
  border: none;
  border-radius: 8px;
}

.placeholder {
  display: grid;
  flex: 1;
  place-items: center;
  color: #888;
}

.create-root {
  display: grid;
  flex: 1;
  place-items: center;
}

.card {
  width: min(560px, calc(100vw - 40px));
  padding: 12px;

  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgb(0 0 0 / 8%);
}

.field {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 8px;
  align-items: center;

  margin: 10px 0;
}

.input,
.textarea {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.row {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.treewrap {
  overflow: auto;
  flex: 1;
  min-height: 0;
}

.nem-field {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 8px;
  margin: 10px 0;
}

.nem-input,
.nem-textarea {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #d0d0da;
  border-radius: 8px;
}
</style>
