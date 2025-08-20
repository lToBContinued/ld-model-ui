<template>
  <div class="run-page">
    <!-- 左侧：方案筛选 + 历史记录 -->
    <aside class="left">
      <header class="left__top">
        <div class="row">
          <select class="select" v-model.number="filters.systemId" @change="reloadSubtrees" style="width: 150px">
            <option :value="0">全部体系</option>
            <option v-for="s in systems" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
          <input
            class="search"
            v-model.trim="filters.keyword"
            placeholder="按方案名称搜索…"
            @keyup.enter="reloadSubtrees"
            style="width: 100px"
          />
        </div>
        <div style="padding-top: 10px">
          <button class="btn" @click="reloadSubtrees" :disabled="loadingList">搜索</button>
          <button class="btn ghost" @click="resetFilters" :disabled="loadingList">重置</button>
        </div>
      </header>

      <section class="left__list">
        <div
          v-for="st in subtrees"
          :key="st.id"
          class="item"
          :class="{ active: currentSubtree && currentSubtree.id === st.id }"
          @click="selectSubtree(st)"
        >
          <div class="item__main">
            <div class="title" :title="st.name">{{ st.name }}</div>
            <div class="desc" v-if="st.description">{{ st.description }}</div>
            <div class="meta">体系ID：{{ st.systemId }}</div>
          </div>
        </div>
        <div v-if="!loadingList && subtrees.length === 0" class="empty">暂无数据</div>
        <div v-if="loadingList" class="empty">加载中…</div>
      </section>

      <section class="left__history" v-if="currentSubtree">
        <div class="row" style=" align-items: center;justify-content: space-between">
          <strong>填写记录</strong>
          <button class="btn" @click="loadRuns">刷新</button>
        </div>
        <div class="history">
          <div v-for="r in runs" :key="r.id" class="hist-item" @click="openRun(r)">
            <div class="hist-title">{{ r.title || '记录#' + r.id }}</div>
            <div class="hist-meta">
              <span>得分：{{ r.totalScore ?? '-' }}</span>
              <span>{{ r.createdAt }}</span>
            </div>
          </div>
          <div v-if="runs.length === 0" class="empty">暂无记录</div>
        </div>
      </section>
    </aside>

    <!-- 右侧：填写界面 -->
    <main class="right">
      <header class="right__top">
        <div class="title">
          <template v-if="currentSubtree">
            <span>{{ currentSubtree.name }}</span>
            <small class="sys">（所属体系：{{ currentSystemName }}）</small>
          </template>
          <template v-else>请选择方案</template>
        </div>
        <div class="actions" v-if="currentSubtree">
          <label class="switch">
            <input type="checkbox" v-model="treeMode" />
            <span>树形填写</span>
          </label>
          <button class="btn" @click="resetForm" :disabled="saving">重置</button>
          <button class="btn primary" @click="saveAndEvaluate" :disabled="saving">保存并计算</button>
        </div>
      </header>

      <section v-if="!currentSubtree" class="placeholder">请选择左侧一个方案。</section>

      <section v-else class="fillwrap">
        <ParamMindMode v-if="treeMode" key="tree" :subtree-id="currentSubtree.id" v-model="valueMap" :tree="treeVO" />
        <ParamTableMode v-else key="table" :subtree-id="currentSubtree.id" v-model="valueMap" :flat="flatSchema" />
      </section>

      <!-- 计算结果（可选） -->
      <section v-if="lastResult" class="result">
        <h4>计算结果</h4>
        <div class="sum">
          方案总分：<b>{{ lastResult.totalScore }}</b>
        </div>
        <details>
          <summary>展开查看节点得分</summary>
          <ul>
            <li v-for="n in lastResult.nodes" :key="n.nodeId">
              {{ nodeNameById[n.nodeId] || '节点#' + n.nodeId }}：{{ n.score }}
            </li>
          </ul>
        </details>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { getSystemsPage, type IndicatorSystem } from '@/api/systems.ts'
import { pageSubtrees, getSubtreeTree } from '@/api/subtrees.ts'
import { listRunsBySubtree, createRun, saveRunValues, evaluateRun, getRunDetail } from '@/api/runs.ts'
import ParamMindMode from '@/components/SubtreeRun/ParamMindMode.vue'
import ParamTableMode from '@/components/SubtreeRun/ParamTableMode.vue'
import { listParamsByNode } from '@/api/subtrees.ts'

/** 左侧：体系 + 方案列表 */
const systems = ref<IndicatorSystem[]>([])
const subtrees = ref<any[]>([])
const loadingList = ref(false)
const filters = ref<{ systemId: number; keyword: string }>({ systemId: 0, keyword: '' })
const currentSubtree = ref<any | null>(null)

const page = ref(1),
  size = ref(20),
  total = ref(0)
async function loadSystems() {
  const resp = await getSystemsPage({ page: 1, size: 100 })
  systems.value = Array.isArray(resp?.list) ? resp.list : Array.isArray(resp) ? resp : []
}
async function loadSubtrees() {
  loadingList.value = true
  try {
    const resp: any = await pageSubtrees({
      page: page.value,
      size: size.value,
      systemId: filters.value.systemId || undefined,
      keyword: filters.value.keyword || undefined,
    })
    const recs = Array.isArray(resp?.records) ? resp.records : (resp?.list ?? [])
    subtrees.value = recs || []
    total.value = resp?.total ?? subtrees.value.length
  } finally {
    loadingList.value = false
  }
}
function reloadSubtrees() {
  page.value = 1
  loadSubtrees()
}
function resetFilters() {
  filters.value = { systemId: 0, keyword: '' }
  reloadSubtrees()
}

function selectSubtree(st: any) {
  currentSubtree.value = st
  loadTreeAndSchema()
  loadRuns()
}

/** 右侧：两种模式共享的 valueMap（paramId -> value） */
const valueMap = ref<Record<number, number | string>>({})

/** 树 + 展平 schema */
const treeVO = ref<any | null>(null)
const flatSchema = ref<any[]>([])
const nodeNameById = ref<Record<number, string>>({})
async function loadTreeAndSchema() {
  valueMap.value = {}
  lastResult.value = null
  const vo = await getSubtreeTree(currentSubtree.value!.id)
  treeVO.value = vo || null
  flatSchema.value = toFlatSchema(vo)
  buildNodeNameMap(vo)
  await prefetchEnabledParams()
}

function buildNodeNameMap(root: any) {
  const map: Record<number, string> = {}
  function walk(n: any) {
    map[n.id] = n.name
    ;(n.children || []).forEach(walk)
  }
  if (root) walk(root)
  nodeNameById.value = map
}

function toFlatSchema(root: any) {
  const list: any[] = []
  function walk(n: any, path: string[]) {
    const curPath = [...path, n.name]
    // 你的接口：listParamsByNode(nodeId) 可以在 ParamTableMode 里按需拉取，这里先不取，表单组件内部会延迟加载
    list.push({ type: 'node', nodeId: n.id, path: curPath.join(' / '), name: n.name })
    ;(n.children || []).forEach((c: any) => walk(c, curPath))
  }
  if (root) walk(root, [])
  return list
}

/** 历史记录 */
const runs = ref<any[]>([])
async function loadRuns() {
  if (!currentSubtree.value) return
  const list = await listRunsBySubtree(currentSubtree.value.id, { page: 1, size: 30 })
  runs.value = (Array.isArray(list) ? list : []).filter((r) => r && Number.isFinite(r.id))
}
async function openRun(r: any) {
  if (!r || !r.id) return
  const detail = await getRunDetail(r.id)
  const map: Record<number, number | string> = {}
  ;(detail?.paramValues || []).forEach((pv: any) => {
    map[pv.paramId] = pv.value
  })
  valueMap.value = map
  lastResult.value = detail?.result ?? null
}

/** 右侧顶栏 */
const currentSystemName = computed(() => {
  if (!currentSubtree.value) return ''
  const s = systems.value.find((x) => x.id === currentSubtree.value.systemId)
  return s?.name || ''
})
const treeMode = ref(true)
function resetForm() {
  valueMap.value = {}
}

/** 保存并计算 */
const saving = ref(false)
const lastResult = ref<any | null>(null)
async function saveAndEvaluate() {
  if (!(await validateAll())) {
    alert(submitError.value || '信息未填写完整')
    return
  }
  if (!currentSubtree.value) return
  try {
    saving.value = true
    const title = `${currentSubtree.value.name} · ${new Date().toLocaleString()}`
    const runId = await createRun({ subtreeId: currentSubtree.value.id, title })
    if (!runId || !Number.isFinite(runId)) throw new Error('创建运行记录失败：runId 无效')

    // ★ 用预取过的启用参数集合
    const enabledSet = new Set<number>(enabledParams.value.map((p) => p.id))

    const items = Object.entries(valueMap.value || {})
      .map(([pid, v]) => ({
        paramId: Number(pid),
        value: typeof v === 'number' ? v : null,
        sourceKey: typeof v === 'string' ? (v as string) : null,
      }))
      .filter((it) => enabledSet.has(it.paramId))

    // 注意：这里调用的 saveRunValues 需要能接受“数组”版本
    await saveRunValues(runId, items as any)

    const res = await evaluateRun(runId)
    lastResult.value = res
    await loadRuns()
    alert('已保存并完成计算')
  } catch (e: any) {
    alert(e?.message || '保存/计算失败')
  } finally {
    saving.value = false
  }
}

/** 方案就绪性 + 参数完整性校验 */
const canSubmit = ref(false)
const submitError = ref<string>('')

function validateSync(): boolean {
  submitError.value = ''
  if (!treeVO.value) {
    submitError.value = '无树数据'
    return false
  }

  const vm = valueMap.value || {}
  for (const p of enabledParams.value) {
    const v = vm[p.id]
    if (v == null || v === '') {
      submitError.value = `参数[${p.name}] 未填写`
      return false
    }
    if (p.type === 1) {
      const num = Number(v)
      if (Number.isNaN(num)) {
        submitError.value = `参数[${p.name}] 需要数字`
        return false
      }
      if (p.minValue != null && num < Number(p.minValue)) {
        submitError.value = `参数[${p.name}] 不能小于 ${p.minValue}`
        return false
      }
      if (p.maxValue != null && num > Number(p.maxValue)) {
        submitError.value = `参数[${p.name}] 不能大于 ${p.maxValue}`
        return false
      }
    } else {
      if (String(v).trim() === '') {
        submitError.value = `参数[${p.name}] 不能为空`
        return false
      }
    }
  }
  return true
}

async function validateAll(): Promise<boolean> {
  if (enabledParams.value.length === 0) await prefetchEnabledParams()
  return validateSync()
}

// 启用参数的元信息（只取 enabled==1）
const enabledParams = ref<any[]>([])

async function prefetchEnabledParams() {
  if (!treeVO.value) {
    enabledParams.value = []
    return
  }
  const nodeIds: number[] = []
  ;(function collect(n: any) {
    nodeIds.push(n.id)
    ;(n.children || []).forEach(collect)
  })(treeVO.value)

  const lists = await Promise.all(
    nodeIds.map((id) =>
      listParamsByNode(id).then((res: any) => (Array.isArray(res) ? res : (res?.list ?? res?.records ?? []))),
    ),
  )
  enabledParams.value = lists.flat().filter((p: any) => (p.enabled ?? 1) === 1)
}

watch(
  [treeVO, valueMap],
  () => {
    canSubmit.value = validateSync()
  },
  { immediate: true, deep: true },
)

onMounted(async () => {
  await loadSystems()
  await loadSubtrees()
})
</script>

<style scoped>
.run-page {
  display: flex;
  width: 100vw;
  height: 100vh;
  background: #fafafa;
}

.left {
  display: flex;
  flex-direction: column;

  width: 320px;

  background: #fff;
  border-right: 1px solid #eee;
}

.left__top {
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.select,
.search {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.btn {
  cursor: pointer;

  padding: 6px 10px;

  background: #f4f6ff;
  border: none;
  border-radius: 8px;
}

.btn.primary {
  color: #fff;
  background: #4c7dff;
}

.btn.ghost {
  background: #f7f7f7;
}

.left__list {
  overflow: auto;
  flex: 1;
  padding: 8px;
}

.item {
  cursor: pointer;

  margin: 6px 0;
  padding: 8px;

  border: 1px solid #eee;
  border-radius: 10px;
}

.item.active {
  border-color: #4c7dff;
  box-shadow: 0 0 0 2px rgb(76 125 255 / 12%);
}

.item .title {
  overflow: hidden;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item .desc {
  font-size: 12px;
  color: #666;
}

.empty {
  padding: 12px;
  color: #999;
  text-align: center;
}

.left__history {
  padding: 10px;
  border-top: 1px solid #f0f0f0;
}

.history {
  overflow: auto;
  max-height: 40vh;
}

.hist-item {
  cursor: pointer;

  margin: 6px 0;
  padding: 8px;

  border: 1px solid #eee;
  border-radius: 8px;
}

.hist-title {
  font-weight: 600;
}

.hist-meta {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #666;
}

.right {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.right__top {
  display: flex;
  align-items: center;
  justify-content: space-between;

  height: 56px;
  padding: 0 12px;

  background: #fff;
  border-bottom: 1px solid #eee;
}

.title .sys {
  margin-left: 6px;
  color: #666;
}

.fillwrap {
  overflow: auto;
  flex: 1;
  min-height: 0;
  padding: 10px;
}

.result {
  padding: 10px;
  background: #fff;
  border-top: 1px solid #eee;
}

.sum {
  margin: 6px 0;
}

.switch {
  display: flex;
  gap: 6px;
  align-items: center;
}
</style>
