<template>
  <div class="table-mode">
    <!-- 有数据时显示表格；否则显示空态 -->
    <div v-if="rows.length" class="tbl-wrap">
      <table class="tbl">
        <!-- 固定每列宽度，避免跳动 -->
        <colgroup>
          <col style="width: 40%" />
          <col style="width: 22%" />
          <col style="width: 14%" />
          <col style="width: 24%" />
        </colgroup>

        <!-- 表头固定在顶端 -->
        <thead>
          <tr>
            <th>路径 / 节点</th>
            <th>参数名</th>
            <th>类型</th>
            <th>值</th>
          </tr>
        </thead>

        <tbody>
          <!-- 外层循环：每个“节点”一组 -->
          <template v-for="row in rows" :key="row.nodeId">
            <!-- 节点分组行：点击可折叠/展开参数 -->
            <tr class="node-row" :class="{ open: row.open }" @click="toggle(row)">
              <td colspan="4">
                <div class="node-cell">
                  <span class="caret" :class="{ open: row.open }" aria-hidden="true"></span>
                  <b class="path" :title="row.path">{{ row.path }}</b>
                  <span class="tip">点击展开/收起参数</span>
                  <span class="count" v-if="row.params.length">共 {{ row.params.length }} 项</span>
                </div>
              </td>
            </tr>

            <!-- 加载中 -->
            <tr v-if="row.open && row.loading">
              <td colspan="4" class="loading">
                <span class="spinner" />
                正在加载参数…
              </td>
            </tr>
            <!-- 展开后无参数 -->
            <tr v-if="row.open && !row.loading && row.params.length === 0">
              <td colspan="4" class="empty">该节点暂无参数</td>
            </tr>

            <!-- 参数行：只在该节点展开时渲染 -->
            <template v-if="row.open">
              <tr v-for="p in row.params" :key="p.id" class="param-row">
                <!-- 路径列（显示所在节点路径，便于辨识） -->
                <td>
                  <div class="cell-path" :title="row.path">{{ row.path }}</div>
                </td>

                <!-- 参数名 + 范围提示（数字型才显示） -->
                <td>
                  <div class="cell-name">
                    <span class="name">{{ p.name }}</span>
                    <span v-if="p.type === 1 && (p.minValue != null || p.maxValue != null)" class="range">
                      {{ p.minValue ?? '-∞' }} ~ {{ p.maxValue ?? '+∞' }}
                    </span>
                  </div>
                </td>

                <!-- 类型徽章 -->
                <td>
                  <span class="badge" :class="p.type === 1 ? 'blue' : 'purple'">
                    {{ p.type === 1 ? '数字' : '映射' }}
                  </span>
                </td>

                <!-- 取值输入：
                   数字型：number 输入框（lazy 防抖，回车/失焦更新）
                   映射型：text + datalist 可选项 + 快捷胶囊 -->
                <td>
                  <div class="field">
                    <template v-if="p.type === 1">
                      <input
                        class="input"
                        type="number"
                        step="any"
                        v-model.lazy="model[p.id]"
                        :min="p.minValue ?? undefined"
                        :max="p.maxValue ?? undefined"
                        :placeholder="p.defaultValue ?? ''"
                      />
                    </template>

                    <template v-else>
                      <div class="map-field">
                        <!-- 自由输入或从 datalist 选择一个“源键” -->
                        <input
                          class="input"
                          type="text"
                          :list="`dl-${p.id}`"
                          v-model="model[p.id]"
                          placeholder="输入或选择源键"
                        />
                        <datalist :id="`dl-${p.id}`">
                          <option v-for="m in sortedEntries(p)" :key="m.key" :value="m.key">{{ m.key }}</option>
                        </datalist>

                        <!-- 可选：把映射表做成小胶囊，点一下就填入 -->
                        <div v-if="(p.mapEntries?.length || 0) > 0" class="chips">
                          <button
                            v-for="m in sortedEntries(p)"
                            :key="m.key"
                            type="button"
                            class="chip"
                            @click.prevent="model[p.id] = m.key"
                            :title="String(m.key)"
                          >
                            {{ m.key }}
                          </button>
                        </div>
                      </div>
                    </template>
                  </div>
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>

    <!-- 空态提示 -->
    <div v-else class="empty-panel">
      <div class="empty-icon">📄</div>
      <div class="empty-title">该方案暂无参数</div>
      <div class="empty-sub">请选择其它方案，或在左侧更换筛选条件</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { listParamsByNode } from '@/api/subtrees'

defineOptions({ name: 'ParamTableMode' })

/** Props
 * - subtreeId：当前方案 id（供接口使用）
 * - flat：扁平的节点列表（包含 nodeId/path）
 * - modelValue：参数值映射（paramId -> number|string）
 */
const props = defineProps<{
  subtreeId: number
  flat: Array<{ nodeId: number; path: string }>
  modelValue: Record<number, number | string>
}>()

/** 向父组件同步参数值的变更（v-model:modelValue） */
const emit = defineEmits(['update:modelValue'])

/** 本地副本：直接双向绑定表单控件 */
const model = ref<Record<number, any>>(props.modelValue || {})
// 外部 v-model 变化 → 同步到本地
watch(
  () => props.modelValue,
  (v) => (model.value = v || {}),
)
// 本地变化（深度监听）→ 向外 emit
watch(model, (v) => emit('update:modelValue', v), { deep: true })

/** 表格数据：每个元素代表一个“节点分组” */
const rows = ref<any[]>([])
// flat 列表变化 → 重新构建分组数据（初始为未展开、未加载）
watch(
  () => props.flat,
  (v) => {
    const list = Array.isArray(v) ? v : []
    rows.value = list.map((x) => ({ ...x, open: false, loading: false, params: [] as any[] }))
  },
  { immediate: true },
)

/** 展开/折叠某个节点：
 * - 第一次展开时拉取参数
 * - 只保留启用的参数（enabled=1）
 */
async function toggle(row: any) {
  row.open = !row.open
  if (row.open && row.params.length === 0) {
    row.loading = true
    try {
      const list: any = await listParamsByNode(row.nodeId)
      row.params = (Array.isArray(list) ? list : (list?.list ?? list?.records ?? [])).filter(
        (p: any) => (p.enabled ?? 1) === 1,
      )
    } finally {
      row.loading = false
    }
  }
}

/** 把映射项按 orderIndex 排序，次序相同再按 key 字典序 */
function sortedEntries(p: any) {
  const arr = (p?.mapEntries ?? []).slice()
  arr.sort(
    (a: any, b: any) =>
      (a?.orderIndex ?? 0) - (b?.orderIndex ?? 0) ||
      String(a?.key ?? '').localeCompare(String(b?.key ?? ''), 'zh-Hans-CN'),
  )
  return arr
}
</script>

<style scoped>
/* 主题变量（按需要替换为品牌色） */
.table-mode {
  --c-border: #e6e8f0;
  --c-border-strong: #d9dbea;
  --c-bg: #fff;
  --c-bg-muted: #f7f8ff;
  --c-text: #111827;
  --c-sub: #6b7280;
  --c-primary: #4c7dff;
  --c-primary-weak: #eef2ff;
  --shadow: 0 1px 2px rgb(0 0 0 / 4%);
}

/* 外框与滚动区域 */
.tbl-wrap {
  overflow: hidden;

  background: var(--c-bg);
  border: 1px solid var(--c-border);
  border-radius: 12px;
  box-shadow: var(--shadow);
}

/* 表格基础样式 */
.tbl {
  border-spacing: 0;
  border-collapse: separate;
  width: 100%;
}

th,
td {
  padding: 10px 12px;
  text-align: left;
}

thead th {
  position: sticky;
  z-index: 1; /* 表头吸顶 */
  top: 0;

  font-weight: 600;
  color: #374151;

  background: #f8f9fe;
  border-bottom: 1px solid var(--c-border-strong);
}

tbody td {
  border-top: 1px solid var(--c-border);
}

/* 节点分组行（整行可点） */
.node-row td {
  padding: 0;
  background: linear-gradient(180deg, #fbfbff 0%, #f7f8ff 100%);
  border-top: 1px solid var(--c-border-strong);
}

.node-cell {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px 12px;
}

/* 小三角折叠标记 */
.caret {
  position: relative;

  flex: none;

  width: 16px;
  height: 16px;

  background: #fff;
  border: 1px solid var(--c-border);
  border-radius: 4px;
}

.caret::before {
  content: '';

  position: absolute;
  inset: 0;
  transform: rotate(0deg);

  width: 0;
  height: 0;
  margin: auto;

  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 6px solid var(--c-primary);
}

.node-row.open .caret::before {
  transform: rotate(90deg);
}

.path {
  font-weight: 600;
  color: #111827;
}

.tip {
  margin-left: 8px;
  font-size: 12px;
  color: var(--c-sub);
}

.count {
  margin-left: auto;
  padding: 2px 8px;

  font-size: 12px;
  color: #4b5563;

  background: #f1f4ff;
  border: 1px solid #e1e6ff;
  border-radius: 999px;
}

/* 参数行 hover 态 */
.param-row:hover {
  background: #fcfdff;
}

.cell-path {
  overflow: hidden;

  max-width: 520px;

  color: #374151;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cell-name {
  display: flex;
  gap: 8px;
  align-items: center;
}

.cell-name .name {
  font-weight: 600;
}

.range {
  padding: 2px 6px;

  font-size: 12px;
  color: #6b7280;

  background: #f3f4f6;
  border-radius: 6px;
}

/* 类型徽章 */
.badge {
  display: inline-block;

  padding: 4px 8px;

  font-size: 12px;
  line-height: 1;

  border: 1px solid transparent;
  border-radius: 999px;
}

.badge.blue {
  color: #1d4ed8;
  background: #eff6ff;
  border-color: #dbeafe;
}

.badge.purple {
  color: #6d28d9;
  background: #f5f3ff;
  border-color: #ede9fe;
}

/* 输入控件 */
.field {
  display: flex;
  gap: 8px;
  align-items: center;
}

.input {
  width: 100%;
  padding: 8px 10px;

  color: var(--c-text);

  background: #fff;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  outline: none;

  transition:
    box-shadow 0.15s ease,
    border-color 0.15s ease;
}

.input:focus {
  border-color: var(--c-primary);
  box-shadow: 0 0 0 3px rgb(76 125 255 / 15%);
}

/* 加载 / 空 */
.loading,
.empty {
  padding: 14px 12px;
  color: #6b7280;
}

.spinner {
  display: inline-block;

  width: 14px;
  height: 14px;
  margin-right: 8px;

  border: 2px solid #c7d2fe;
  border-top-color: var(--c-primary);
  border-radius: 50%;

  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 空态卡片 */
.empty-panel {
  padding: 48px 16px;

  color: #6b7280;
  text-align: center;

  background: #fff;
  border: 1px dashed var(--c-border);
  border-radius: 12px;
}

.empty-icon {
  font-size: 32px;
}

.empty-title {
  margin-top: 8px;
  font-weight: 700;
  color: #111827;
}

.empty-sub {
  margin-top: 4px;
  font-size: 13px;
}

/* 映射字段：候选项胶囊 */
.map-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  cursor: pointer;

  padding: 4px 8px;

  font-size: 12px;
  color: #3b5bfd;

  background: #f1f4ff;
  border: 1px solid #e1e6ff;
  border-radius: 999px;
}

.chip:hover {
  background: #e9edff;
}
</style>
