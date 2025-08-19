<template>
  <div class="spe" v-if="nodeId">
    <!-- 顶栏：标题 + 刷新/新增 -->
    <header class="spe__top">
      <div class="spe__title">参数配置</div>
      <div class="spe__actions">
        <button class="btn" @click="reload" :disabled="loading">刷新</button>
        <button class="btn primary" @click="startCreate" :disabled="loading || readonly">新增参数</button>
      </div>
    </header>

    <!-- 主体：左侧列表 + 右侧编辑 -->
    <section class="spe__body" v-if="!loading && params.length > 0">
      <!-- 左：当前节点下的参数清单（可选择、上下移动、删除） -->
      <aside class="spe__list">
        <div
          v-for="(p, idx) in params"
          :key="p.id"
          class="spe__item"
          :class="{ active: idx === selIndex }"
          @click="selectIndex(idx)"
        >
          <div class="spe__item-row">
            <span class="spe__item-name" :title="p.name">
              <span v-if="p.enabled !== 1" class="tag tag--muted">OFF</span>
              {{ p.name }}
            </span>
            <span class="spe__item-type">{{ p.type === 1 ? '数字' : '映射' }}</span>
          </div>
          <div class="spe__item-row spe__item-ops">
            <!-- 前端本地换位后，调用 reorderParams 持久化顺序 -->
            <button class="link" @click.stop="moveUp(idx)" :disabled="idx===0 || loading || readonly">↑</button>
            <button class="link" @click.stop="moveDown(idx)" :disabled="idx===params.length-1 || loading || readonly">↓</button>
            <button class="link danger" @click.stop="delParam(p)" :disabled="loading || readonly">删除</button>
          </div>
        </div>
      </aside>

      <!-- 右：选中参数的编辑表单；数字型与映射型展示不同字段 -->
      <main class="spe__editor" v-if="current">
        <div class="field-row">
          <label>名称</label>
          <input v-model.trim="currentDraft.name" class="input" :readonly="readonly" />
        </div>

        <!-- 启用开关：直接双向绑定到计算属性 draftEnabled，内部再调后端接口落库 -->
        <div class="field-row">
          <label>启用</label>
          <label class="switch">
            <input type="checkbox" v-model="draftEnabled" @change="onToggleEnabled" />
            <span></span>
          </label>
        </div>

        <div class="field-row">
          <label>类型</label>
          <select v-model.number="currentDraft.type" class="input" :disabled="readonly">
            <option :value="1">数字型</option>
            <option :value="2">映射型</option>
          </select>
        </div>

        <!-- 数字型：最小/最大/默认值 -->
        <template v-if="currentDraft.type === 1">
          <div class="field-row">
            <label>最小值</label>
            <input type="number" class="input" v-model.number="currentDraft.minValue" :disabled="readonly" />
          </div>
          <div class="field-row">
            <label>最大值</label>
            <input type="number" class="input" v-model.number="currentDraft.maxValue" :disabled="readonly" />
          </div>
          <div class="field-row">
            <label>默认值</label>
            <input type="number" class="input" v-model.number="currentDraft.defaultValue" :disabled="readonly" />
          </div>
        </template>

        <!-- 映射型：维护 key→value 的映射表，支持上下移动与增删 -->
        <template v-else>
          <div class="map__head">
            <div class="map__title">映射规则</div>
            <div class="map__ops">
              <button class="btn" @click="addMapRow" :disabled="readonly">新增项</button>
            </div>
          </div>

          <div class="map__table">
            <div class="map__row map__row--head">
              <div class="col col-key">输入</div>
              <div class="col col-val">映射值</div>
              <div class="col col-ops">操作</div>
            </div>

            <div class="map__row" v-for="(m, mi) in currentDraft.mapEntries" :key="mi">
              <div class="col col-key">
                <input class="input" v-model.trim="m.key" placeholder="如：优秀" :disabled="readonly" />
              </div>
              <div class="col col-val">
                <input class="input" type="number" v-model.number="m.value" placeholder="如：100" :disabled="readonly" />
              </div>
              <div class="col col-ops">
                <button class="link" @click="mapUp(mi)" :disabled="mi===0 || readonly">↑</button>
                <button class="link" @click="mapDown(mi)" :disabled="mi===currentDraft.mapEntries.length-1 || readonly">↓</button>
                <button class="link danger" @click="removeMapRow(mi)" :disabled="readonly">删除</button>
              </div>
            </div>
          </div>
        </template>

        <!-- 表单底部：重置草稿（回到后端数据），保存（逐项调后端） -->
        <div class="editor__actions">
          <button class="btn" @click="resetDraft" :disabled="loading || readonly">重置</button>
          <button class="btn primary" @click="saveCurrent" :disabled="loading || readonly || !canSave">保存</button>
        </div>
      </main>
    </section>

    <!-- 空态/加载态 -->
    <section class="spe__empty" v-else-if="!loading">
      <p>暂无参数</p>
    </section>
    <section class="spe__loading" v-else>
      <p>加载中…</p>
    </section>

    <!-- “新增参数”弹窗：与右侧编辑表单相同的字段，但面向创建 -->
    <teleport to="body">
      <div v-if="createOpen" class="spe-mask" @click.self="closeCreate">
        <div class="spe-dialog">
          <header class="dlg__header">
            <strong>新增参数</strong>
            <button class="btn ghost" @click="closeCreate">✕</button>
          </header>

          <div class="dlg__body">
            <div class="field-row">
              <label>名称</label>
              <input v-model.trim="createForm.name" class="input" />
            </div>
            <div class="field-row">
              <label>类型</label>
              <select v-model.number="createForm.type" class="input">
                <option :value="1">数字型</option>
                <option :value="2">映射型</option>
              </select>
            </div>

            <!-- 数字型创建字段 -->
            <template v-if="createForm.type===1">
              <div class="field-row">
                <label>最小值</label>
                <input type="number" class="input" v-model.number="createForm.minValue" />
              </div>
              <div class="field-row">
                <label>最大值</label>
                <input type="number" class="input" v-model.number="createForm.maxValue" />
              </div>
              <div class="field-row">
                <label>默认值</label>
                <input type="number" class="input" v-model.number="createForm.defaultValue" />
              </div>
            </template>

            <!-- 映射型创建字段：支持多行映射项一次性提交 -->
            <template v-else>
              <div class="map__head">
                <div class="map__title">映射规则</div>
                <div class="map__ops">
                  <button class="btn" @click="createAddMapRow">新增项</button>
                </div>
              </div>
              <div class="map__table">
                <div class="map__row map__row--head">
                  <div class="col col-key">输入</div>
                  <div class="col col-val">映射值</div>
                  <div class="col col-ops">操作</div>
                </div>
                <div class="map__row" v-for="(m, mi) in createForm.mapEntries" :key="mi">
                  <div class="col col-key">
                    <input class="input" v-model.trim="m.key" placeholder="如：优秀" />
                  </div>
                  <div class="col col-val">
                    <input class="input" type="number" v-model.number="m.value" placeholder="如：100" />
                  </div>
                  <div class="col col-ops">
                    <button class="link" @click="createMapUp(mi)" :disabled="mi===0">↑</button>
                    <button class="link" @click="createMapDown(mi)" :disabled="mi===createForm.mapEntries.length-1">↓</button>
                    <button class="link danger" @click="createRemoveMapRow(mi)">删除</button>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <footer class="dlg__footer">
            <button class="btn" @click="closeCreate">取消</button>
            <button class="btn primary" @click="doCreate" :disabled="!createForm.name">保存</button>
          </footer>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import {
  listParamsByNode,      // 拉取某节点下的参数列表
  createParam,           // 新建参数（可携带映射项）
  updateParam,           // 更新参数基本信息
  deleteParam,           // 删除参数
  listMapEntries,        // 读取映射项
  replaceMapEntries,     // 覆盖式写入映射项
  toggleParam,           // （备用）开关启用的旧接口
  reorderParams,         // 保存参数顺序
  type SubtreeParamVO,
  type ParamMapEntryDTO,
  updateParamEnabled     // 首选：通过 ?enabled=1 的 PUT 更新启用状态
} from '@/api/subtrees'

/** 输入属性：
 * - nodeId：当前正在编辑的“子树节点”ID
 * - readonly：只读模式下禁止编辑
 */
const props = withDefaults(defineProps<{
  nodeId: number | null
  readonly?: boolean
}>(), {
  readonly: false
})

/** 对外事件：
 * - changed：保存/删除/新增等成功后通知父层刷新其它关联视图
 * - error：统一错误通知（也会 alert 一下）
 */
const emit = defineEmits<{
  (e: 'changed'): void
  (e: 'error', msg: string): void
}>()

/** 视图模型类型：VO + 可选映射项 */
type ParamVM = SubtreeParamVO & { mapEntries?: ParamMapEntryDTO[] }

/** 本地状态 */
const loading = ref(false)
const params = ref<ParamVM[]>([])          // 左侧列表数据
const selIndex = ref<number>(0)             // 当前选中的列表索引

const current = computed<ParamVM | undefined>(() => params.value[selIndex.value]) // 选中项
const currentDraft = ref<any | null>(null) // 右侧编辑草稿（与后端数据解耦）

/** 新增参数弹窗相关 */
const createOpen = ref(false)
const createForm = ref<any>({
  name: '', type: 1, minValue: null, maxValue: null, defaultValue: null,
  mapEntries: [] as ParamMapEntryDTO[]
})

/** 是否只读（禁用所有写操作） */
const readonly = computed(() => !!props.readonly)

/** 统一错误提示 */
function notify(msg: string) {
  emit('error', msg)
  alert(msg)
}

/** 拉取某个参数的映射表（API 层已把 shape 统一成 {key,value,orderIndex}） */
async function loadOneParamMap(pid: number): Promise<ParamMapEntryDTO[]> {
  try {
    const list = await listMapEntries(pid)
    return list
  } catch (e: any) {
    notify(e.message || '加载映射项失败')
    return []
  }
}

/** 拉取当前 nodeId 下的全部参数；映射型若后端未内联 mapEntries，则额外补拉一次 */
async function loadParams() {
  if (!props.nodeId) {
    params.value = []
    selIndex.value = 0
    currentDraft.value = null
    return
  }
  loading.value = true
  try {
    const list = await listParamsByNode(props.nodeId)
    const out: ParamVM[] = []
    for (const p of list) {
      let mapEntries = p.mapEntries
      if (p.type === 2 && (!mapEntries || mapEntries.length === 0)) {
        mapEntries = await loadOneParamMap(p.id)
      }
      out.push({ ...p, mapEntries })
    }
    // 按 orderIndex 排序，和右侧编辑顺序一致
    params.value = out.sort((a, b) => (a.orderIndex - b.orderIndex))

    // 初始化/校正选中项与草稿
    if (params.value.length === 0) {
      selIndex.value = 0
      currentDraft.value = null
    } else {
      if (selIndex.value < 0 || selIndex.value >= params.value.length) selIndex.value = 0
      makeDraftFromCurrent()
    }
  } catch (e: any) {
    notify(e.message || '加载参数失败')
    params.value = []
    currentDraft.value = null
  } finally {
    loading.value = false
  }
}

/** 从当前选中项创建可编辑草稿（避免直接改动列表数据） */
function makeDraftFromCurrent() {
  const p = current.value
  if (!p) { currentDraft.value = null; return }
  currentDraft.value = {
    id: p.id,
    nodeId: p.nodeId,
    name: p.name,
    type: p.type,
    enabled: p.enabled === 1 ? 1 : 0,   // 规范成 0/1
    minValue: p.type === 1 ? (p.minValue ?? null) : null,
    maxValue: p.type === 1 ? (p.maxValue ?? null) : null,
    defaultValue: p.type === 1 ? (p.defaultValue ?? null) : null,
    mapEntries: p.type === 2 ? (p.mapEntries ? p.mapEntries.map(it => ({ ...it })) : []) : []
  }
}

/** 选择左侧某一项并刷新右侧草稿 */
function selectIndex(i: number) {
  if (i < 0 || i >= params.value.length) return
  selIndex.value = i
  makeDraftFromCurrent()
}

/** 右下角“重置” -> 回到后端最新值 */
function resetDraft() { makeDraftFromCurrent() }

/** —— 新增参数（弹窗） —— */
function startCreate() {
  createForm.value = { name: '', type: 1, minValue: null, maxValue: null, defaultValue: null, mapEntries: [] }
  createOpen.value = true
}
function closeCreate() { createOpen.value = false }
function createAddMapRow() { createForm.value.mapEntries.push({ key: '', value: 0 }) }
function createRemoveMapRow(idx: number) { createForm.value.mapEntries.splice(idx, 1) }
function createMapUp(idx: number) { if (idx>0) [createForm.value.mapEntries[idx-1], createForm.value.mapEntries[idx]] = [createForm.value.mapEntries[idx], createForm.value.mapEntries[idx-1]] }
function createMapDown(idx: number) { const arr=createForm.value.mapEntries; if (idx<arr.length-1) [arr[idx],arr[idx+1]]=[arr[idx+1],arr[idx]] }

/** 新增提交：前端做同名与范围的快速校验；映射型一次性提交映射项 */
async function doCreate() {
  if (!props.nodeId) return
  const nid = Number(props.nodeId)
  if (!Number.isFinite(nid)) { notify('无效的节点ID'); return }
  const name = (createForm.value.name || '').trim()
  if (!name) { notify('请填写参数名称'); return }

  // 前端同层重名预校验（后端仍会二次校验）
  const dup = (params.value || []).some(p => (p.name || '').trim() === name)
  if (dup) { notify('同一节点下已存在该名称'); return }

  // 数字型边界检查
  if (createForm.value.type === 1) {
    const {minValue:min, maxValue:max, defaultValue:def} = createForm.value
    if (min != null && max != null && Number(min) > Number(max)) return notify('最小值不能大于最大值')
    if (def != null) {
      const d = Number(def)
      if (!Number.isFinite(d)) return notify('默认值必须是数字')
      if (min != null && d < Number(min)) return notify(`默认值不能小于最小值 ${min}`)
      if (max != null && d > Number(max)) return notify(`默认值不能大于最大值 ${max}`)
    }
  }

  // 映射型清洗（去空/去重/补 orderIndex）
  let mapEntries: Array<{ key: string; value: number; orderIndex: number }> | undefined
  if (createForm.value.type === 2) {
    const raw = Array.isArray(createForm.value.mapEntries) ? createForm.value.mapEntries : []
    const seen = new Set<string>()
    const cleaned: typeof raw = []
    raw.forEach((it: any, idx: number) => {
      const k = String(it?.key ?? '').trim()
      if (!k || seen.has(k)) return
      seen.add(k)
      const num = Number(it?.value)
      cleaned.push({ key: k, value: Number.isFinite(num) ? num : 0, orderIndex: idx })
    })
    mapEntries = cleaned
  }

  try {
    const newId = await createParam(nid, {
      name,
      type: createForm.value.type,
      enabled: 1,
      minValue: createForm.value.type === 1 ? (createForm.value.minValue ?? null) : null,
      maxValue: createForm.value.type === 1 ? (createForm.value.maxValue ?? null) : null,
      defaultValue: createForm.value.type === 1 ? (createForm.value.defaultValue ?? null) : null,
      mapEntries, // 一次性提交，减少额外请求
    })

    createOpen.value = false
    await reload()                     // 刷新列表
    const idx = params.value.findIndex(p => p.id === newId) // 聚焦新建项
    if (idx >= 0) selectIndex(idx)
    emit('changed')
  } catch (e: any) {
    const msg = e?.message || ''
    if (/created_at|updated_at/i.test(msg)) notify('服务器时间字段未填充，请检查后端自动填充策略')
    else if (/409|唯一|重复|已存在|重名|key/i.test(msg)) notify(msg || '创建失败：存在唯一性冲突')
    else notify(msg || '新增失败')
  }
}

/** “保存当前”按钮可用性：基础必填 + 类型对应字段的合法性 */
const canSave = computed(() => {
  const d = currentDraft.value
  if (!d || !d.name) return false
  if (d.type === 1) {
    if (d.minValue != null && d.maxValue != null && Number(d.minValue) > Number(d.maxValue)) return false
  } else {
    if ((d.mapEntries || []).some((m: any) => !m.key)) return false
  }
  return true
})

/** 保存当前选中参数：先更新基本信息；若为映射型，再覆盖提交映射项 */
async function saveCurrent() {
  const d = currentDraft.value
  if (!d) return
  try {
    await updateParam(d.id, {
      name: d.name,
      type: d.type,
      enabled: d.enabled ? 1 : 0,
      minValue: d.type === 1 ? (d.minValue ?? null) : null,
      maxValue: d.type === 1 ? (d.maxValue ?? null) : null,
      defaultValue: d.type === 1 ? (d.defaultValue ?? null) : null
    })
    if (d.type === 2) {
      const items = (d.mapEntries || []).map((it: ParamMapEntryDTO, idx: number) => ({
        key: String(it.key), value: Number(it.value), orderIndex: idx
      }))
      await replaceMapEntries(d.id, items)
    }
    await reload()
    const idx = params.value.findIndex(p => p.id === d.id)
    if (idx >= 0) selectIndex(idx)   // 保持选中项不变
    emit('changed')
  } catch (e: any) {
    notify(e.message || '保存失败')
  }
}

/** 启用/禁用：先本地乐观更新，再调用接口；失败则回滚 */
const draftEnabled = computed({
  get: () => !!currentDraft.value?.enabled,
  set: (v:boolean) => { if (currentDraft.value) currentDraft.value.enabled = v ? 1 : 0 }
})
async function onToggleEnabled() {
  if (!currentDraft.value) return
  const id = currentDraft.value.id
  const next = draftEnabled.value     // true/false
  const prev = !next

  // 乐观更新（列表与草稿一起改）
  currentDraft.value.enabled = next ? 1 : 0
  const idx = params.value.findIndex(p => p.id === id)
  if (idx >= 0) params.value[idx].enabled = next ? 1 : 0

  try {
    await updateParamEnabled(id, next)  // 走 PUT ?enabled=1 的轻量接口
    emit('changed')
  } catch (e:any) {
    // 回滚 UI
    currentDraft.value.enabled = prev ? 1 : 0
    if (idx >= 0) params.value[idx].enabled = prev ? 1 : 0
    draftEnabled.value = prev
    alert(e?.message || '启用状态更新失败')
  }
}

/** 删除参数：确认后调后端，刷新并保持索引有效 */
async function delParam(p: SubtreeParamVO) {
  if (!confirm(`删除参数「${p.name}」？该操作不可恢复。`)) return
  try {
    await deleteParam(p.id)
    await reload()
    selIndex.value = Math.max(0, Math.min(selIndex.value, params.value.length - 1))
    makeDraftFromCurrent()
    emit('changed')
  } catch (e: any) {
    notify(e.message || '删除失败')
  }
}

/** 上下移动：本地换位 + 调用 reorderParams 落库；失败会整体刷新回滚 */
async function moveUp(idx: number) {
  if (idx <= 0 || !props.nodeId) return
  const a = params.value[idx - 1]
  params.value[idx - 1] = params.value[idx]
  params.value[idx] = a
  await saveOrder()
  selIndex.value = idx - 1
}
async function moveDown(idx: number) {
  if (idx >= params.value.length - 1 || !props.nodeId) return
  const a = params.value[idx + 1]
  params.value[idx + 1] = params.value[idx]
  params.value[idx] = a
  await saveOrder()
  selIndex.value = idx + 1
}
async function saveOrder() {
  if (!props.nodeId) return
  try {
    await reorderParams(props.nodeId, params.value.map(p => p.id))
  } catch (e: any) {
    notify(e.message || '保存顺序失败')
    await reload()
  }
}

/** 当前草稿里增删/排序映射项（仅本地，保存时 replaceMapEntries 一次性提交） */
function addMapRow() { currentDraft.value?.mapEntries?.push({ key: '', value: 0 }) }
function removeMapRow(i: number) { currentDraft.value?.mapEntries?.splice(i, 1) }
function mapUp(i: number) {
  if (!currentDraft.value) return
  const arr = currentDraft.value.mapEntries as ParamMapEntryDTO[]
  if (i > 0) [arr[i-1], arr[i]] = [arr[i], arr[i-1]]
}
function mapDown(i: number) {
  if (!currentDraft.value) return
  const arr = currentDraft.value.mapEntries as ParamMapEntryDTO[]
  if (i < arr.length - 1) [arr[i], arr[i+1]] = [arr[i+1], arr[i]]
}

/** 生命周期：nodeId 变化时自动加载；初次挂载也加载 */
async function reload() { await loadParams() }
watch(() => props.nodeId, () => { selIndex.value = 0; loadParams() }, { immediate: true })
onMounted(loadParams)
</script>

<style scoped>
/* 结构与布局样式（保持你原来的视觉规范） */
.spe { display: flex; flex-direction: column; height: 100%; background: #fff; border: 1px solid #eee; border-radius: 12px; }
.spe__top { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-bottom: 1px solid #f0f0f0; }
.spe__title { font-weight: 700; }
.spe__actions { display: flex; gap: 8px; }

.spe__body { flex: 1; display: grid; grid-template-columns: 300px 1fr; min-height: 0; }
.spe__list { border-right: 1px solid #f0f0f0; overflow-y: auto; padding: 6px; }
.spe__item { border: 1px solid #eee; border-radius: 10px; padding: 8px; margin: 6px 0; cursor: pointer; }
.spe__item.active { border-color: #4c7dff; box-shadow: 0 0 0 2px rgba(76,125,255,.12); }
.spe__item-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.spe__item-name { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; }
.spe__item-type { font-size: 12px; color: #666; }
.spe__item-ops { margin-top: 6px; }
.link { border: none; background: transparent; color: #4c7dff; cursor: pointer; padding: 0 4px; }
.link.danger { color: #c0392b; }

.spe__editor { padding: 12px; overflow: auto; }
.field-row { display: grid; grid-template-columns: 100px 1fr; gap: 10px; align-items: center; margin: 12px 0; }
.input { width: 100%; border: 1px solid #ddd; border-radius: 8px; padding: 6px 8px; }

/* 开关样式 */
.switch { position: relative; display: inline-block; width: 44px; height: 24px; }
.switch input { opacity: 0; width: 0; height: 0; }
.switch span { position: absolute; cursor: pointer; inset: 0; background: #ddd; border-radius: 24px; transition: .2s; }
.switch span::before { content: ""; position: absolute; left: 3px; top: 3px; width: 18px; height: 18px; background: #fff; border-radius: 50%; transition: .2s; }
.switch input:checked + span { background: #4c7dff; }
.switch input:checked + span::before { transform: translateX(20px); }

.editor__actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 14px; }

/* 映射表格 */
.map__head { display: flex; align-items: center; justify-content: space-between; margin: 10px 0 4px; }
.map__title { font-weight: 600; }
.map__ops { display: flex; gap: 8px; }
.map__table { border: 1px solid #eee; border-radius: 8px; overflow: hidden; }
.map__row { display: grid; grid-template-columns: 1fr 200px 160px; gap: 8px; align-items: center; padding: 8px; border-top: 1px solid #f5f5f5; }
.map__row--head { background: #fafafa; font-weight: 600; }
.col { padding: 2px; }
.col-ops { display: flex; align-items: center; gap: 6px; }

.spe__empty, .spe__loading { flex: 1; display: grid; place-items: center; color: #888; }

/* 按钮 */
.btn { border: none; background: #f4f6ff; padding: 6px 10px; border-radius: 8px; cursor: pointer; }
.btn.primary { background: #4c7dff; color: #fff; }
.btn.ghost { background: #f7f7f7; }

/* 状态小标签 */
.tag { display: inline-block; padding: 0 6px; border-radius: 6px; font-size: 12px; margin-right: 6px; }
.tag--muted { background: #f0f0f0; color: #666; }

/* 新增参数弹窗（z-index 提高，盖住其它对话框） */
.spe-mask {
  position: fixed; inset: 0; background: rgba(0,0,0,.4);
  display: grid; place-items: center; z-index: 3400;
}
.spe-dialog {
  width: min(720px, calc(100vw - 40px));
  max-height: min(86vh, 860px);
  overflow: auto;
  background: #fff; border-radius: 12px; padding: 12px;
  box-shadow: 0 24px 80px rgba(0,0,0,.28);
}
.dlg__header{ display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
.dlg__body{ padding:6px 2px; }
.dlg__footer{ display:flex; justify-content:flex-end; gap:8px; margin-top:12px; }
</style>
