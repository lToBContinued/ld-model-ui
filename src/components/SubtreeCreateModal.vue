<template>
  <!-- Teleport：把弹窗挂到 body，避免被父容器的 overflow / z-index 影响 -->
  <teleport to="body">
    <!-- 遮罩层；@click.self 表示仅点击遮罩空白处才关闭，不影响对话框内部点击 -->
    <div v-if="open" class="scm__mask" @click.self="cancel">
      <!-- 对话框主体，带无障碍属性 -->
      <div class="scm__dialog" role="dialog" aria-modal="true">
        <header class="scm__header">
          <strong>新建子树</strong>
          <button class="btn ghost" @click="cancel">✕</button>
        </header>

        <div class="scm__body">
          <!-- 选择所属“指标体系” -->
          <label class="field">
            <span>所属体系</span>
            <!-- v-model.number：把选中的值转成 number（后端更容易接） -->
            <select v-model.number="local.systemId" class="select">
              <option disabled :value="0">请选择</option>
              <option v-for="s in systems" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </label>

          <!-- 子树名称，必填 -->
          <label class="field">
            <span>名称</span>
            <input v-model.trim="local.name" class="input" placeholder="子树名称"/>
          </label>

          <!-- 子树描述，选填 -->
          <label class="field">
            <span>描述</span>
            <textarea v-model.trim="local.description" class="textarea" rows="3"></textarea>
          </label>

          <!-- 外部传入的错误信息（例如后端返回“重名”） -->
          <p v-if="error" class="error">{{ error }}</p>
        </div>

        <footer class="scm__footer">
          <button class="btn" @click="cancel">取消</button>
          <!-- 必须选了体系且填了名称才允许创建 -->
          <button class="btn primary" :disabled="!local.systemId || !local.name" @click="save">创建</button>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { IndicatorSystem } from '@/api/systems'

/** Props
 * - open：是否显示弹窗
 * - systems：供选择的“指标体系”集合
 * - error：父组件传入的错误提示（接口失败/重名等）
 */
const props = defineProps<{
  open: boolean
  systems: IndicatorSystem[]
  error?: string | null
}>()

/** 事件
 * - update:open：配合 v-model:open 关闭弹窗
 * - cancel：用户取消
 * - save：点击创建时把表单数据抛给父组件
 */
const emit = defineEmits<{
  (e:'update:open', v:boolean): void
  (e:'cancel'): void
  (e:'save', payload:{ systemId:number; name:string; description?:string|null }): void
}>()

/** 本地表单副本：避免直接修改 props */
const local = reactive<{ systemId:number; name:string; description?:string|null }>({
  systemId: 0, name:'', description:''
})

/** 每次弹窗打开时，重置表单（确保是干净状态） */
watch(()=>props.open, (o)=>{
  if(o){
    local.systemId = 0
    local.name = ''
    local.description = ''
  }
})

/** 关闭弹窗：通知父组件，并修改 v-model:open */
function cancel(){
  emit('cancel')
  emit('update:open', false)
}

/** 点击“创建”：把当前表单内容抛给父组件，由父组件决定如何发请求与处理错误 */
function save(){
  emit('save', { ...local })
}
</script>

<style scoped>
/* 遮罩层：置顶并居中对话框
   z-index 比“选择指标”弹窗略低，避免互相遮挡 */
.scm__mask{
  position:fixed; z-index: 2200; inset:0;

  display:grid; place-items:center;

 background:rgb(0 0 0 / 35%);
}

/* 对话框外观：宽度自适应、圆角、阴影 */
.scm__dialog{
  width:min(560px, calc(100vw - 32px)); padding:12px;

  background:#fff; border-radius:12px;
  box-shadow:0 20px 60px rgb(0 0 0 / 20%);
}
.scm__header{ display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }

/* 表单：左标签右输入 */
.field{
  display:grid; grid-template-columns:90px 1fr; gap:8px; align-items:center;

 margin:10px 0;
}

.input,.select,.textarea{
  width:100%; padding:6px 8px; border:1px solid #ddd; border-radius:8px;
}

.scm__footer{ display:flex; gap:8px; justify-content:flex-end; margin-top:8px; }

/* 按钮风格 */
.btn{ cursor:pointer;

 padding:6px 12px;

 background:#f4f6ff; border:none; border-radius:8px; }
.btn.primary{ color:#fff; background:#4c7dff; }
.btn.ghost{ background:#f7f7f7; }

/* 错误提示（由父组件传入） */
.error{ color:#c0392b; }
</style>
