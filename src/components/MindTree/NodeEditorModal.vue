<template>
  <!-- Teleport：把弹窗渲染到 <body>，避免被父容器样式影响 -->
  <Teleport to="body">
    <!-- 背景遮罩；@click.self 只在点到空白处时关闭 -->
    <div v-if="open" class="nem-backdrop" @click.self="close">
      <!-- 弹窗本体；加上无障碍属性 -->
      <div class="nem-modal" role="dialog" aria-modal="true" :aria-label="title">
        <header class="nem-header">
          <strong>{{ title }}</strong>
          <button class="nem-btn" @click="close">✕</button>
        </header>

        <!-- 内容插槽：默认提供“名称/备注”两个字段；也可用 slot 完全替换 -->
        <slot name="body" :local="local">
          <label class="nem-field">
            <span>名称</span>
            <input v-model="local.label" class="nem-input" />
          </label>
          <label class="nem-field">
            <span>备注</span>
            <textarea v-model="local.note" class="nem-textarea" rows="4"></textarea>
          </label>
        </slot>

        <footer class="nem-actions">
          <button class="nem-btn" @click="close">取消</button>
          <button class="nem-btn nem-primary" @click="save">保存</button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

/**
 * Props：
 * - open：是否显示弹窗
 * - draft：外部传入的初始数据
 * - title：标题（默认“编辑节点”）
 */
const props = withDefaults(defineProps<{ open: boolean; draft: any; title?: string }>(), { title: '编辑节点' })

/** 事件：
 * - update:open：用于双向绑定 v-model:open
 * - save：点击保存时，把编辑后的数据抛给父组件
 */
const emit = defineEmits<{
  (e: 'update:open', v: boolean): void
  (e: 'save', draft: any): void
}>()

/** 本地副本：在弹窗里编辑，避免直接改动外部的 draft */
const local = ref<any>({})

/** 监听 open：弹窗打开时，用外部 draft 初始化本地副本（深拷贝，避免引用关联） */
watch(
  () => props.open,
  (o) => {
    if (o) local.value = JSON.parse(JSON.stringify({ note: '', ...props.draft }))
  },
  { immediate: true }, // 组件初次挂载时也执行一次，保持状态同步
)

/** 监听 draft：当父组件更新草稿内容且弹窗打开时，刷新本地副本 */
watch(
  () => props.draft,
  (d) => {
    if (props.open) local.value = JSON.parse(JSON.stringify({ note: '', ...d }))
  },
)

/** 关闭弹窗：通知父组件把 open 设为 false */
function close() {
  emit('update:open', false)
}

/** 保存：把编辑后的本地副本深拷贝后抛给父组件 */
function save() {
  emit('save', JSON.parse(JSON.stringify(local.value)))
}
</script>

<style scoped>
/* 背景遮罩：居中摆放弹窗 */
.nem-backdrop {
  position: fixed;
  z-index: 1000;
  inset: 0;

  display: grid;
  place-items: center;

  background: rgb(0 0 0 / 35%);
}

/* 弹窗盒子：白底、圆角、阴影、内边距 */
.nem-modal {
  width: min(600px, calc(100vw - 32px));
  padding: 14px;

  background: #fff;
  border-radius: 12px;
  box-shadow: 0 12px 40px rgb(0 0 0 / 18%);
}

/* 头部：标题 + 关闭按钮 */
.nem-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

/* 表单行：左标签右输入 */
.nem-field {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 8px;
  align-items: center;

  margin: 10px 0;
}

/* 输入样式 */
.nem-input,
.nem-textarea {
  width: 100%;
  padding: 6px 8px;

  font-size: 14px;

  border: 1px solid #d0d0da;
  border-radius: 8px;
}

/* 底部按钮行 */
.nem-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 12px;
}

/* 按钮样式 */
.nem-btn {
  cursor: pointer;

  padding: 6px 10px;

  background: #f2f4ff;
  border: none;
  border-radius: 8px;
}

.nem-primary {
  color: #fff;
  background: #4c7dff;
}
</style>
