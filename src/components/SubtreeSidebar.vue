<template>
  <!-- 子树侧边栏（可筛选/分页/选择/删除/新建） -->
  <aside class="ssb">
    <header class="top">
      <!-- 第一行：关键字搜索框，回车触发搜索 -->
      <div class="row">
        <input v-model="keyword" class="input" placeholder="按方案名搜索…" @keyup.enter="search"/>
      </div>

      <!-- 第二行：体系下拉 + 查询/重置/新建按钮 -->
      <div class="row">
        <select v-model.number="systemId" class="select" style="width: 25%">
          <option :value="0">全部体系</option>
          <option v-for="s in systems" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
        <button class="btn" @click="search" :disabled="loading">查询</button>
        <button class="btn ghost" @click="reset" :disabled="loading && !keyword && !systemId">重置</button>
        <button class="btn primary" @click="$emit('request-create')" :disabled="loading">新建子树</button>
      </div>
    </header>

    <!-- 列表：显示当前页的子树；选中高亮，右上角有删除按钮 -->
    <section class="list" v-if="list.length>0">
      <div
        class="item"
        v-for="it in list"
        :key="it.id"
        :class="{ active: it.id===selectedId }"
        @click="select(it)"
      >
        <div class="title">{{ it.name }}</div>
        <div class="desc">
          <span>体系：{{ sysName(it.systemId) }}</span>
          <span v-if="it.description"> · {{ it.description }}</span>
        </div>
        <div class="ops">
          <!-- 阻止冒泡：只弹删除，不改变选中 -->
          <button class="btn danger" @click.stop="$emit('request-delete', it)">删</button>
        </div>
      </div>
    </section>

    <!-- 空态/加载态 -->
    <section v-else class="empty">
      <p>{{ loading ? '加载中…' : '没有数据' }}</p>
    </section>

    <!-- 分页条：首/前/后/尾；禁用态跟随 loading 与边界 -->
    <footer class="pager">
      <button class="btn" :disabled="page<=1||loading" @click="goto(1)">«</button>
      <button class="btn" :disabled="page<=1||loading" @click="goto(page-1)">上一页</button>
      <span>第 {{ page }} / {{ pages }} 页 · 共 {{ total }} 条</span>
      <button class="btn" :disabled="page>=pages||loading" @click="goto(page+1)">下一页</button>
      <button class="btn" :disabled="page>=pages||loading" @click="goto(pages)">»</button>
    </footer>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getSubtreesPage, type SubtreeSummary } from '@/api/subtrees'
import { getSystemsPage, type IndicatorSystem } from '@/api/systems'

/** 对外事件：
 * - select：选中某个子树
 * - request-create：点击“新建子树”
 * - request-delete：请求删除某个子树
 * - error：请求失败时向父级报告
 */
const emit = defineEmits<{
  (e:'select', v: SubtreeSummary|null): void
  (e:'request-create'): void
  (e:'request-delete', v: SubtreeSummary): void
  (e:'error', msg: string): void
}>()

/** 本地状态 */
const systems = ref<IndicatorSystem[]>([])     // 体系下拉用
const list = ref<SubtreeSummary[]>([])         // 子树列表（当前页）
const loading = ref(false)
const page = ref(1)
const size = ref(7)                            // 每页固定 7
const pages = ref(1)
const total = ref(0)

const keyword = ref('')                        // 搜索关键字
const systemId = ref<number>(0)                // 体系过滤（0=全部）
const selectedId = ref<number|null>(null)      // 当前选中子树 id

/** 根据 systemId 找显示名（兜底显示 id） */
function sysName(id: number){ return systems.value.find(s=>s.id===id)?.name || id }

/** 拉取体系（用于下拉） */
async function fetchSystems() {
  try {
    const data = await getSystemsPage({ page:1, size:999 })
    const rows = Array.isArray(data) ? data : (data.list || data.items || [])
    systems.value = rows as IndicatorSystem[]
  } catch (e:any) {
    emit('error', e.message || String(e))
  }
}

/** 拉取子树分页数据（后端返回结构已在 API 层 getSubtreesPage 统一） */
async function fetchPage() {
  loading.value = true
  try {
    const res = await getSubtreesPage({
      page: page.value,
      size: size.value,
      systemId: systemId.value || undefined,
      keyword: keyword.value || undefined
    })
    list.value = res.list || []
    total.value = res.total || list.value.length
    pages.value = res.pages || Math.max(1, Math.ceil(total.value / size.value))

    // 若当前选中项不在本页，清空选中并通知外部
    if (selectedId.value && !list.value.some(i=>i.id===selectedId.value)) {
      selectedId.value = null
      emit('select', null)
    }
  } catch (e:any) {
    emit('error', e.message || String(e))
    list.value = []; total.value=0; pages.value=1
  } finally { loading.value=false }
}

/** 搜索/重置/翻页/选择 */
function search(){ page.value=1; fetchPage() }
function reset(){ keyword.value=''; systemId.value=0; page.value=1; fetchPage() }
function goto(p:number){ if (p<1||p>pages.value||loading.value) return; page.value=p; fetchPage() }
function select(it: SubtreeSummary){ selectedId.value=it.id; emit('select', it) }

/** 首次挂载：先拉体系选项，再拉第一页子树数据 */
onMounted(() => { fetchSystems(); fetchPage() })

/** 暴露给父组件的刷新方法 */
defineExpose({ refresh: fetchPage })
</script>

<style scoped>
/* 容器与头部 */
.ssb{ display:flex; flex-direction:column;

 width:340px; min-width:300px;

 background:#fff; border-right:1px solid #eee; }
.top{ padding:10px; border-bottom:1px solid #f0f0f0; }
.row{ display:flex; gap:8px; margin:6px 0; }
.input,.select{ flex:1; padding:6px 8px; border:1px solid #ddd; border-radius:8px; }

/* 按钮 */
.btn{ cursor:pointer;

 padding:6px 10px;

 background:#f4f6ff; border:none; border-radius:8px; }
.btn.primary{ color:#fff; background:#4c7dff; }
.btn.ghost{ background:#f7f7f7; }
.btn.danger{ color:#c0392b; background:#ffecec; }

/* 列表项样式与选中态 */
.list{ overflow:auto; flex:1; padding:8px; }

.item{ cursor:pointer;

 position:relative;

 margin:6px 0; padding:8px;

 border:1px solid #eee; border-radius:10px; }
.item.active{ border-color:#4c7dff; box-shadow:0 0 0 2px rgb(76 125 255 / 12%); }
.title{ overflow:hidden; font-weight:600; text-overflow:ellipsis; white-space:nowrap; }

.desc{ overflow:hidden;

 margin-top:2px;

 font-size:12px; color:#666; text-overflow:ellipsis; white-space:nowrap; }
.ops{ position:absolute; top:8px; right:8px; }

/* 空态与分页条 */
.empty{ display:grid; flex:1; place-items:center; color:#999; }

.pager{ display:flex; gap:8px; align-items:center; justify-content:center;

 padding:8px;

 border-top:1px solid #f0f0f0; }
</style>
