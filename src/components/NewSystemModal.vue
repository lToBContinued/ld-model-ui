<template>
  <!-- Teleport：把弹窗挂到 body，避免被父容器的 overflow / z-index 影响 -->
  <teleport to="body">
    <!-- 遮罩，点空白处关闭（@click.self 只在点击遮罩自身时触发） -->
    <div v-if="open" class="sm__mask" @click.self="cancel">
      <!-- 对话框主体 -->
      <div class="sm__dialog" role="dialog" aria-modal="true">
        <header class="sm__header">
          <!-- 按模式切换标题：create=新建；edit=编辑 -->
          <strong>{{ mode === 'create' ? '新建指标体系' : '编辑指标体系' }}</strong>
          <button class="btn ghost" @click="cancel">✕</button>
        </header>

        <div class="sm__body">
          <!-- 名称：必填；trim 去掉两端空白；maxlength 防止超长 -->
          <label class="field">
            <span>名称</span>
            <input v-model.trim="local.name" class="input" maxlength="255" />
          </label>

          <!-- 描述：可为空；trim 去空白 -->
          <label class="field">
            <span>描述</span>
            <textarea v-model.trim="local.description" class="textarea" rows="3"></textarea>
          </label>

          <!-- 外部传入的错误信息（如后端“重名”校验失败），集中展示 -->
          <p v-if="error" class="error">{{ error }}</p>
        </div>

        <footer class="sm__footer">
          <button class="btn" @click="cancel">取消</button>
          <!-- 没有名称时禁用保存按钮，避免空提交 -->
          <button class="btn primary" :disabled="!local.name" @click="save">保存</button>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { reactive, watch, withDefaults } from 'vue'

/** 组件模式：
 * - create：新建体系
 * - edit：编辑已有体系
 */
type Mode = 'create' | 'edit'

/** Props：
 * - open：是否显示
 * - mode：模式（create / edit）
 * - model：外部传入的初始值（编辑时带 id；新建可为空）
 * - error：外部错误信息（由父组件控制，比如接口返回“名称已存在”）
 */
const props = withDefaults(
  defineProps<{
    open: boolean
    mode: Mode
    model?: { id?: number; name?: string; description?: string | null }
    error?: string | null
  }>(),
  {
    open: false,
    mode: 'create',
    model: () => ({ name: '', description: '' }),
    error: null,
  },
)

/** 事件：
 * - update:open：用于 v-model:open（关闭弹窗）
 * - save：点击保存时把表单数据抛给父组件
 * - cancel：用户取消
 */
const emit = defineEmits<{
  (e: 'update:open', v: boolean): void
  (e: 'save', payload: { id?: number; name: string; description?: string | null; mode: Mode }): void
  (e: 'cancel'): void
}>()

/** 本地表单副本：
 *  用 reactive 接住外部 model，避免直接改 props
 */
const local = reactive<{ id?: number; name: string; description?: string | null }>({ name: '', description: '' })

/** 监听外部 model 变化：
 *  - 弹窗每次打开 / 父组件切换编辑对象时，同步到本地表单
 */
watch(
  () => props.model,
  (m) => {
    local.id = m?.id
    local.name = m?.name || ''
    local.description = m?.description ?? ''
  },
  { immediate: true },
)

/** 关闭：通知父组件并收起弹窗 */
function cancel() {
  emit('cancel')
  emit('update:open', false)
}

/** 保存：把当前表单内容 + 模式一并抛给父组件处理（父组件负责调接口与错误展示） */
function save() {
  emit('save', {
    id: local.id,
    name: local.name,
    description: local.description ?? '',
    mode: props.mode,
  })
}
</script>

<style scoped>
/* 遮罩层：置顶并居中对话框 */
.sm__mask {
  position: fixed;
  z-index: 2200;
  inset: 0;

  display: grid;
  place-items: center;

  background: rgb(0 0 0 / 35%);
}

/* 对话框容器：宽度自适应、圆角与阴影 */
.sm__dialog {
  width: min(520px, calc(100vw - 32px));
  padding: 12px;

  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgb(0 0 0 / 20%);
}

.sm__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.sm__body {
  padding: 6px 2px;
}

/* 表单两列：左标签右输入 */
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

/* 底部按钮 */
.sm__footer {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 8px;
}

.btn {
  cursor: pointer;

  padding: 6px 12px;

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

/* 错误提示（如名称重名） */
.error {
  margin-top: 6px;
  color: #c0392b;
}
</style>
