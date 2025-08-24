<template>
  <!-- Teleport：把弹窗挂到 body，避免被父容器的定位/overflow 影响 -->
  <teleport to="body">
    <!-- 遮罩。@click.self 只在点到空白处时关闭 -->
    <div v-if="open" class="ipm__mask" @click.self="cancel">
      <!-- 对话框本体，带无障碍属性；回车=确认，Esc=取消 -->
      <div
        class="ipm__dialog"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        @keydown.enter.prevent.stop="confirm"
        @keydown.escape.prevent.stop="cancel"
      >
        <header class="ipm__header">
          <strong>{{ title }}</strong>
          <button class="btn ghost" @click="cancel">✕</button>
        </header>

        <!-- 顶部搜索框：按名称/描述过滤 -->
        <div class="ipm__toolbar">
          <input v-model="kw" class="input" placeholder="搜索名称/描述…" />
        </div>

        <!-- 列表区域：展示某一层的候选指标 -->
        <div class="ipm__list">
          <div
            v-for="it in filtered"
            :key="it.id"
            class="ipm__item"
            :class="{ active: sel && sel.id === it.id }"
            @click="select(it)"
            @dblclick="pick(it)"
          >
            <div class="ipm__main">
              <div class="ipm__title">{{ it.name }}</div>
              <div v-if="it.description" class="ipm__desc">{{ it.description }}</div>
            </div>
          </div>
          <div v-if="filtered.length === 0" class="ipm__empty">没有可选项</div>
        </div>

        <!-- 底部按钮 -->
        <footer class="ipm__footer">
          <button class="btn" @click="cancel">取消</button>
          <button class="btn primary" :disabled="!sel" @click="confirm">选择</button>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

/** 母树 VO：从后端拿到的指标树（任意层级） */
interface IndicatorTreeVO {
  id: number
  name: string
  description?: string | null
  children?: IndicatorTreeVO[]
}

/** Props
 * - open：是否显示弹窗
 * - title：标题
 * - masterTree：整棵“母树”
 * - parentRefIndicatorId：限定只显示哪个母树节点的直接子节点；null 表示显示根的 children
 */
const props = withDefaults(
  defineProps<{
    open: boolean
    title?: string
    masterTree?: IndicatorTreeVO | null
    parentRefIndicatorId?: number | null
  }>(),
  {
    title: '选择指标',
  },
)

/** 事件
 * - update:open：配合 v-model:open
 * - picked：选中并确定某个节点
 * - cancel：用户取消
 */
const emit = defineEmits<{
  (e: 'update:open', v: boolean): void
  (e: 'picked', item: { id: number; name: string; description?: string | null }): void
  (e: 'cancel'): void
}>()

/** 本地状态：关键字、当前选中项 */
const kw = ref('')
const sel = ref<{ id: number; name: string; description?: string | null } | null>(null)

/** 计算“当前这一层”的候选：父=parentRefIndicatorId 的直接 children
 *  parent 为 null → 取 masterTree 根的 children
 */
const layer = computed(() => {
  const t = props.masterTree
  if (!t) return [] as IndicatorTreeVO[]

  // 递归找指定 id 的节点
  const findById = (root: IndicatorTreeVO, id: number): IndicatorTreeVO | null => {
    if (root.id === id) return root
    for (const c of root.children || []) {
      const got = findById(c, id)
      if (got) return got
    }
    return null
  }

  const parent = props.parentRefIndicatorId == null ? t : findById(t, props.parentRefIndicatorId)
  return parent?.children || []
})

/** 把 VO 转成简单列表（只保留 id/name/description） */
const list = computed(() =>
  (layer.value || []).map((c) => ({ id: c.id, name: c.name, description: c.description || '' })),
)

/** 关键字过滤（支持名称/描述） */
const filtered = computed(() => {
  const k = kw.value.trim().toLowerCase()
  if (!k) return list.value
  return list.value.filter((i) => i.name.toLowerCase().includes(k) || (i.description || '').toLowerCase().includes(k))
})

/** 每次打开弹窗时，重置搜索与选中 */
watch(
  () => props.open,
  (o) => {
    if (o) {
      kw.value = ''
      sel.value = null
    }
  },
)

/** 列表交互：选中 / 双击即选并关闭 */
function select(it: any) {
  sel.value = it
}
function pick(it: any) {
  sel.value = it
  confirm()
}

/** 取消：发出 cancel，并关闭弹窗 */
function cancel() {
  emit('cancel')
  emit('update:open', false)
}

/** 确认：没有选中就忽略；有选中就抛 picked 并关闭 */
function confirm() {
  if (!sel.value) return
  emit('picked', sel.value)
  emit('update:open', false)
}
</script>

<style scoped>
/* 遮罩层：比其它弹窗层级高一点，防止被挡住 */
.ipm__mask {
  position: fixed;
  z-index: 2300;
  inset: 0;

  display: grid;
  place-items: center;

  background: rgb(0 0 0 / 35%);
}

/* 对话框盒子 */
.ipm__dialog {
  width: min(700px, calc(100vw - 40px));
  padding: 12px;

  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgb(0 0 0 / 22%);
}

.ipm__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

/* 搜索 */
.ipm__toolbar {
  margin-bottom: 8px;
}

.input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

/* 列表 */
.ipm__list {
  overflow: auto;

  max-height: 60vh;
  padding: 6px;

  border: 1px solid #eee;
  border-radius: 10px;
}

.ipm__item {
  cursor: pointer;

  display: flex;
  gap: 8px;

  padding: 8px;

  border-radius: 8px;
}

.ipm__item:hover {
  background: #f8f9ff;
}

.ipm__item.active {
  background: #eef2ff;
  border: 1px solid #dbe4ff;
}

.ipm__title {
  font-weight: 600;
}

.ipm__desc {
  margin-top: 2px;
  font-size: 12px;
  color: #777;
}

.ipm__empty {
  padding: 20px;
  color: #999;
  text-align: center;
}

/* 底部按钮区 */
.ipm__footer {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 10px;
}

.btn {
  cursor: pointer;

  padding: 6px 12px;

  background: #f4f6ff;
  border: none;
  border-radius: 8px;
}

.btn.ghost {
  background: #f7f7f7;
}

.btn.primary {
  color: #fff;
  background: #4c7dff;
}
</style>
