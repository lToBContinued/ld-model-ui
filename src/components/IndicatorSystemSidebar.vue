<template>
  <aside class="iss">
    <!-- 顶部：搜索 + 操作按钮 -->
    <header class="iss__top">
      <div class="iss__search-row">
        <!-- 输入时 300ms 防抖搜索；回车也会触发搜索 -->
        <input
          v-model="keyword"
          type="search"
          class="iss__search"
          placeholder="搜索指标体系…"
          @keyup.enter="doSearch"
          @input="onSearchInput"
        />
      </div>
      <div class="iss__top-actions">
        <!-- 新建/刷新/重置 交互 -->
        <button class="btn primary" @click="requestCreate">新建</button>
        <button class="btn" @click="refresh" :disabled="loading">刷新</button>
        <!-- <button class="btn" @click="doSearch" :disabled="loading">搜索</button> -->
        <button class="btn ghost" @click="resetSearch" :disabled="loading && !keyword">重置</button>
      </div>
    </header>

    <!-- 列表区（有数据时显示列表） -->
    <section class="iss__list" v-if="list.length > 0">
      <!-- 每条体系：点击选中，双击请求编辑；右侧有删除按钮 -->
      <div
        v-for="sys in list"
        :key="sys.id"
        class="iss__item"
        :class="{ active: sys.id === selectedId }"
        @click="select(sys)"
        @dblclick="requestEdit(sys)"
      >
        <div class="iss__item-main">
          <div class="iss__item-title">{{ sys.name }}</div>
          <div v-if="sys.description" class="iss__item-desc">{{ sys.description }}</div>
        </div>
        <button class="btn danger" title="删除该体系" @click.stop="confirmDelete(sys)">删</button>
      </div>
    </section>

    <!-- 没数据时的占位：加载中/空态 -->
    <section v-else class="iss__empty">
      <p v-if="!loading">没有数据</p>
      <p v-else>加载中…</p>
    </section>

    <!-- 底部分页条：固定每页 7 条 -->
    <footer class="iss__pager">
      <div class="pager-left">
        <span>共 {{ total }} 条 · 第 {{ page }} / {{ pages }} 页</span>
      </div>
      <div class="pager-right">
        <button class="btn" :disabled="page<=1 || loading" @click="goto(1)">«</button>
        <button class="btn" :disabled="page<=1 || loading" @click="goto(page-1)">上一页</button>
        <button class="btn" :disabled="page>=pages || loading" @click="goto(page+1)">下一页</button>
        <button class="btn" :disabled="page>=pages || loading" @click="goto(pages)">»</button>
      </div>
    </footer>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getSystemsPage, type IndicatorSystem } from "@/api/systems";

/** 向父组件发事件：选中/新建/删除/错误提示/请求弹窗等 */
const emit = defineEmits<{
  (e: "select", system: IndicatorSystem | null): void;
  (e: "created", id: number): void;
  (e: "deleted", id: number): void;
  (e: "error", msg: string): void;
  (e: "request-delete-system", system: IndicatorSystem): void;
  (e: "request-create-system"): void;
  (e: "request-edit-system", system: IndicatorSystem): void;
}>();

/* ---------------- 状态 ---------------- */
const list = ref<IndicatorSystem[]>([]);   // 当前页的数据
const loading = ref(false);                // 加载中？
const page = ref(1);                       // 当前页
const size = ref(7);                       // 每页固定 7
const total = ref(0);                      // 总条数
const pages = ref(1);                      // 总页数
const keyword = ref("");                   // 搜索关键词
const selectedId = ref<number | null>(null); // 当前选中的体系 ID

/* 防抖用的定时器句柄 */
let searchTimer: number | undefined;

/* ---------------- 拉取分页数据（兼容不同后端返回结构） ---------------- */
async function fetchData() {
  loading.value = true;
  try {
    const resp = await getSystemsPage({
      page: page.value,
      size: size.value,
      orderBy: "updatedAt",
      asc: true,                      // 按更新时间正序
      keyword: keyword.value || undefined,
    });

    // 兼容各种分页字段命名（list/items/records/rows/data/或直接数组）
    const data: any = resp ?? {};
    const rows: any[] = Array.isArray(data)
      ? data
      : Array.isArray(data.list)       ? data.list
      : Array.isArray(data.items)      ? data.items
      : Array.isArray(data.records)    ? data.records
      : Array.isArray(data.rows)       ? data.rows
      : Array.isArray(data.data)       ? data.data
      : [];

    list.value = rows as IndicatorSystem[];

    // 总条数：优先后端 total；否则用当前页数量兜底
    const totalNum = typeof data.total === "number" ? data.total : rows.length;
    total.value = totalNum;

    // pageSize：优先 data.size / data.pageSize；否则用本地 size
    const backendSize =
      typeof data.size === "number" ? data.size
      : typeof data.pageSize === "number" ? data.pageSize
      : size.value;

    // 总页数：优先 data.pages；否则用 total/size 计算（至少 1）
    pages.value =
      typeof data.pages === "number" ? data.pages
      : Math.max(1, Math.ceil(totalNum / Math.max(1, backendSize)));

    // 如果当前页码超过了总页数（比如搜索结果很少），回退到最后一页并重拉
    if (page.value > pages.value && pages.value >= 1) {
      page.value = pages.value;
      await fetchData();
      return;
    }

    // 当选中的项不在当前页时，清空选中并通知父组件
    if (selectedId.value && !list.value.some(i => i.id === selectedId.value)) {
      selectedId.value = null;
      emit("select", null);
    }
  } catch (e: any) {
    // 统一错误反馈给父组件
    emit("error", e.message || String(e));
    list.value = [];
    total.value = 0;
    pages.value = 1;
  } finally {
    loading.value = false;
  }
}

/* ---------------- 搜索 ---------------- */
// 输入时触发：300ms 防抖
function onSearchInput() {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = window.setTimeout(doSearch, 300);
}
// 立即搜索：回到第 1 页
function doSearch() {
  page.value = 1;
  fetchData();
}
// 清空关键词并重查
function resetSearch() {
  keyword.value = "";
  page.value = 1;
  fetchData();
}

/* ---------------- 新建/删除/编辑：仅抛事件，真正弹窗由父组件处理 ---------------- */
function requestCreate(){ emit("request-create-system"); }
function requestEdit(sys: IndicatorSystem){ emit("request-edit-system", sys); }
function confirmDelete(sys: IndicatorSystem){ emit("request-delete-system", sys); }

/* ---------------- 选择与分页 ---------------- */
// 选中列表中的一个体系
function select(sys: IndicatorSystem) {
  selectedId.value = sys.id;
  emit("select", sys);
}
// 跳转页码（越界/加载中时不响应）
function goto(p: number) {
  if (p < 1 || p > pages.value || loading.value) return;
  page.value = p;
  fetchData();
}

/* ---------------- 暴露给父组件的便捷方法 ---------------- */
// 刷新当前页
async function refresh() { await fetchData(); }
// 在当前页内查找某个 id
function findById(id: number): IndicatorSystem | null {
  return list.value.find(s => s.id === id) || null;
}
// 若该 id 在当前页，就选中它
function selectById(id: number) {
  const sys = findById(id);
  if (sys) select(sys);
}

// 组件挂载时先拉一页数据
onMounted(refresh);

// 对外暴露
defineExpose({
  refresh,
  findById,
  selectById,
  getSelectedId: () => selectedId.value,
});
</script>

<style scoped>
/* 侧栏容器 */
.iss{
  width:320px; min-width:280px; height:100%;
  background:#fff; border-right:1px solid #eee;
  display:flex; flex-direction:column;
}
/* 顶部区域：搜索 + 操作 */
.iss__top{ padding:10px; border-bottom:1px solid #f0f0f0; }
.iss__search-row{ display:flex; gap:8px; }
.iss__search{ flex:1; padding:8px 10px; border:1px solid #ddd; border-radius:8px; }
.iss__top-actions{ margin-top:8px; display:flex; gap:8px; }

/* 通用按钮 */
.btn{ border:none; background:#f4f6ff; padding:6px 10px; border-radius:8px; cursor:pointer; }
.btn.primary{ background:#4c7dff; color:#fff; }
.btn.danger{ background:#ffecec; color:#c0392b; }
.btn.ghost{ background:#f7f7f7; }
.btn:disabled{ opacity:.6; cursor:not-allowed; }

/* 列表（每页只渲染 7 条；容器仍可滚动） */
.iss__list{
  overflow-y:auto; padding:6px; flex:1;
}
.iss__item{
  display:flex; align-items:flex-start; gap:8px;
  padding:8px; border:1px solid #eee; border-radius:10px;
  margin:6px 0; cursor:pointer;
}
.iss__item.active{ border-color:#4c7dff; box-shadow:0 0 0 2px rgba(76,125,255,.12); }
.iss__item-main{ flex:1; min-width:0; }
.iss__item-title{ font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.iss__item-desc{ font-size:12px; color:#666; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

/* 空态与分页 */
.iss__empty{ flex:1; display:grid; place-items:center; color:#999; }
.iss__pager{
  padding:8px; display:flex; align-items:center; justify-content:space-between;
  border-top:1px solid #f0f0f0;
}
.pager-right{ display:flex; gap:6px; }
</style>
