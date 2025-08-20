<template>
  <div class="param-mind">
    <!-- MindTree 只接收一个根对象做 v-model -->
    <!-- :readonly="true"  这里是只读：增删改交给外部 -->
    <!-- :externalEditor="true"  双击节点时，抛出 request-edit 事件，由外部弹窗编辑 -->
    <MindTree
      v-model="mindRoot"
      class="mind"
      :readonly="true"
      :externalEditor="true"
      :nodeWidth="220"
      :nodeHeight="60"
      @request-edit="onRequestEdit"
    >
      <!-- 自定义节点外观的插槽；入参 node = 我们喂给 MindTree 的节点 -->
      <template #node="{ node, toggleCollapse }">
        <div class="pm-node" :title="node.label">
          <!-- 折叠/展开按钮；使用 MindTree 暴露的 toggleCollapse() -->
          <button
            class="pm-caret"
            :class="{ collapsed: node.collapsed }"
            aria-label="折叠/展开"
            @click.stop="toggleCollapse()"
          />
          <!-- 节点标题 -->
          <span class="pm-title">{{ node.label }}</span>
          <!-- 打开“填写参数”弹窗 -->
          <button class="pm-chip" @click.stop="openDlgForMind(node)">填写参数</button>
        </div>
      </template>
    </MindTree>

    <!-- 参数填写弹窗（挂到 body 下，避免层级/滚动问题） -->
    <teleport to="body">
      <div v-if="dlgOpen" class="pmask" @click.self="closeDlg">
        <div class="pdlg" role="dialog" aria-modal="true">
          <header class="phdr">
            <strong>填写参数 - {{ dlgNodeName }}</strong>
            <button class="btn ghost" @click="closeDlg">✕</button>
          </header>

          <div class="pbody">
            <!-- 加载态/空态 -->
            <div v-if="loading" class="gray">加载中…</div>
            <div v-else-if="rows.length===0" class="gray">该节点无参数</div>

            <!-- 参数列表 -->
            <div v-else class="plist">
              <div class="prow" v-for="p in rows" :key="p.id">
                <!-- 左侧名称 + 状态 + 数值范围 -->
                <label class="pname">
                  {{ p.name }}
                  <span v-if="(p.enabled ?? 1) !== 1" class="tag-off">未启用</span>
                  <small v-if="p.type===1" class="range">
                    {{ p.minValue ?? '-∞' }} ~ {{ p.maxValue ?? '+∞' }}
                  </small>
                </label>

                <!-- 数值型输入框：受 min/max 限制，留空表示使用默认值 -->
                <input
                  v-if="p.type===1"
                  class="pinput"
                  type="number"
                  :min="p.minValue ?? undefined"
                  :max="p.maxValue ?? undefined"
                  :placeholder="p.defaultValue ?? ''"
                  v-model.lazy="local[p.id]"
                  :disabled="(p.enabled ?? 1) !== 1"
                />

                <!-- 映射型输入：可手输，也可从 datalist 选择 key -->
                <span v-else class="datalist-wrap">
                  <input
                    class="pinput"
                    :list="'dl-'+p.id"
                    placeholder="输入或选择映射源字符串"
                    v-model="local[p.id]"
                    :disabled="(p.enabled ?? 1) !== 1"
                  />
                  <datalist :id="'dl-'+p.id">
                    <option
                      v-for="m in (p.mapEntries || [])"
                      :key="m.key"
                      :value="m.key"
                    >{{ m.key }}</option>
                  </datalist>
                </span>
              </div>
            </div>
          </div>

          <!-- 底部操作 -->
          <footer class="pftr">
            <button class="btn" @click="closeDlg">取消</button>
            <button class="btn primary" @click="saveDlg">保存</button>
          </footer>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
// ⚠️ 保持与项目一致的路径
import MindTree from '@/components/MindTree/MindTree.vue'
import { listParamsByNode } from '@/api/subtrees'

defineOptions({ name: 'ParamMindMode' })

/** 后端返回的树节点形状（仅包含 id/name/children） */
type NodeVO = { id:number; name:string; children?:NodeVO[] }

/** MindTree 需要的节点形状（id/label 为字符串；允许额外属性） */
type MindNode = {
  id: string
  label: string
  children?: MindNode[]
  collapsed?: boolean
  __raw?: { id:number; name:string }   // 轻量原始信息，便于回调时取后端 id
}

/** 参数相关类型 */
type MapEntry = { key:string; value:number; orderIndex?:number }
type ParamVO = {
  id:number; name:string; type:1|2; enabled?:0|1;
  minValue?:number|null; maxValue?:number|null; defaultValue?:number|null;
  mapEntries?:MapEntry[]
}

/** Props：
 * - subtreeId：当前方案 id
 * - modelValue：参数取值的映射（paramId -> number|string）
 * - tree：后端树（NodeVO）用于渲染 MindTree
 */
const props = defineProps<{
  subtreeId: number
  modelValue: Record<number, number | string>
  tree?: NodeVO | null
}>()

/** v-model:modelValue 的事件定义 */
const emit = defineEmits<{ (e:'update:modelValue', v:Record<number, number|string>):void }>()

/** 代理一层，写入时向上传递（保持 v-model 的语义） */
const valueProxy = computed({
  get: () => props.modelValue || {},
  set: (v) => emit('update:modelValue', v)
})

/** NodeVO -> MindNode：MindTree 需要 id:string/label:string */
function toMindNode(vo?: NodeVO | null): MindNode | null {
  if (!vo) return null
  const walk = (n: NodeVO): MindNode => ({
    id: String(n.id),
    label: n.name,
    __raw: { id: n.id, name: n.name },
    children: (n.children || []).map(walk)
  })
  return walk(vo)
}

/** MindTree 根对象（只能是一个节点作为根） */
const mindRoot = ref<MindNode>({ id:'0', label:'空', children:[] })
watch(() => props.tree, (v) => {
  const root = toMindNode(v)
  mindRoot.value = root ?? { id:'0', label:'空', children:[] }
}, { immediate:true })

/* ================= 弹窗状态与数据 ================= */
const dlgOpen = ref(false)
const dlgNodeId = ref<number|null>(null)
const dlgNodeName = ref<string>('')
const loading = ref(false)
const rows = ref<ParamVO[]>([])                  // 当前节点的参数列表
const local = reactive<Record<number, any>>({})  // 输入中的本地副本（paramId -> 值）

/** 用已有的 modelValue 回填弹窗里的本地输入值 */
function mergeFromModel(list: ParamVO[]){
  list.forEach(p => {
    const v = valueProxy.value?.[p.id]
    local[p.id] = v == null ? '' : v
  })
}

/** 根据节点 id 打开弹窗并加载参数 */
async function openDlgById(id:number, name:string){
  dlgNodeId.value = id
  dlgNodeName.value = name
  dlgOpen.value = true
  loading.value = true
  try{
    const res:any = await listParamsByNode(id)
    // 兼容不同返回结构：数组 / {list} / {records}
    const list:ParamVO[] = Array.isArray(res) ? res : (res?.list ?? res?.records ?? [])
    rows.value = list
    mergeFromModel(list)
  } finally {
    loading.value = false
  }
}

/** 从 MindTree 节点对象打开弹窗（slot 的“填写参数”按钮点这里） */
function openDlgForMind(node: MindNode){
  const id = Number(node.id)
  if (!Number.isFinite(id)) return
  openDlgById(id, node.label)
}

/** 双击节点时由 MindTree 抛出的外部编辑事件 */
function onRequestEdit(_id:string, node: MindNode){
  openDlgForMind(node)
}

/** 关闭弹窗 */
function closeDlg(){
  dlgOpen.value = false
  dlgNodeId.value = null
  rows.value = []
}

/** 保存弹窗：做基本校验与截断，再把结果写回 v-model */
function saveDlg(){
  const next = { ...(valueProxy.value || {}) }
  for (const p of rows.value){
    // 未启用的参数：从模型里删除
    if ((p.enabled ?? 1) !== 1) { delete next[p.id]; continue }

    let v:any = local[p.id]
    if (p.type === 1){
      // 数值型：可为空（表示使用默认）；否则必须是数字，并裁剪到 min/max 区间
      if (v === '' || v == null){ next[p.id] = ''; continue }
      let num = Number(v)
      if (Number.isNaN(num)){ alert(`参数【${p.name}】需要数字`); return }
      if (p.minValue != null && num < Number(p.minValue)) num = Number(p.minValue)
      if (p.maxValue != null && num > Number(p.maxValue)) num = Number(p.maxValue)
      next[p.id] = num
    } else {
      // 映射型：保存字符串（服务端会做映射或直接数值化）
      next[p.id] = String(v ?? '')
    }
  }
  emit('update:modelValue', next)
  closeDlg()
}
</script>

<style scoped>
/* 整体布局：上方树，下方弹窗覆盖 */
.param-mind{ display:flex; flex-direction:column; height:100%; }

.mind{ overflow:auto; flex:1;

 min-height:420px; padding:8px;

 background:#fff; border:1px solid #eee; border-radius:10px; }

/* 弹窗及表单样式（与项目现有样式风格保持一致） */
.pmask{ position:fixed; z-index:3400; inset:0;

 display:grid; place-items:center;

 background:rgb(0 0 0 / 35%); }

.pdlg{ width:min(680px, calc(100vw - 40px)); padding:12px;

 background:#fff; border-radius:12px; box-shadow:0 24px 80px rgb(0 0 0 / 22%); }
.phdr{ display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
.pbody{ overflow:auto; max-height:min(70vh, 720px); }
.plist{ display:flex; flex-direction:column; gap:8px; }
.prow{ display:grid; grid-template-columns:180px 1fr; gap:10px; align-items:center; }
.pname .range{ margin-left:6px; color:#999; }
.pinput{ width:100%; padding:6px 8px; border:1px solid #ddd; border-radius:6px; }

.btn.tiny{ cursor:pointer;

 padding:2px 6px;

 background:#eaf1ff; border:none; border-radius:6px; }
.btn.ghost{ background:#f7f7f7; }
.pftr{ display:flex; gap:8px; justify-content:flex-end; margin-top:8px; }
.gray{ color:#888; }

.tag-off{ margin-left:6px; padding:0 6px;

 font-size:12px; color:#888;

 background:#f4f4f4; border-radius:6px; }

/* 自定义节点样式（卡片风） */
.pm-node{
  display: flex; gap: 10px; align-items: center;

  box-sizing: border-box;
  width: 100%; height: 100%;
  padding: 8px 10px;

  background: #fff;
  border: 1px solid #e6e8f0;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgb(16 24 40 / 6%);

  transition: border-color .15s ease, box-shadow .15s ease, transform .03s ease;
}

.pm-node:hover{
  border-color: #9aa6ff;
  box-shadow: 0 0 0 3px rgb(76 125 255 / 14%);
}

.pm-title{ overflow: hidden;
  flex: 1;

 min-width: 0;

  font-weight: 600; text-overflow: ellipsis;
  white-space: nowrap;
}

/* 折叠箭头（纯 CSS） */
.pm-caret{ cursor: pointer;

  position: relative;

  width: 26px; height: 26px;

  background: #f7f8ff;
  border: 1px solid #e6e8f0; border-radius: 50%;

  transition: border-color .15s ease, background .15s ease, transform .15s ease;
}

.pm-caret::before{
  content: "";

 position: absolute; inset: 0;
  transform: rotate(90deg); /* 展开：向下 */

  width: 0; height: 0; margin: auto;

  border-top: 5px solid transparent; border-bottom: 5px solid transparent;
  border-left: 6px solid #4c7dff;
}
.pm-caret.collapsed::before{ transform: rotate(0deg); } /* 折叠：向右 */
.pm-caret:hover{ background:#eef2ff; border-color:#c7d2fe; }

/* “填写参数”胶囊按钮 */
.pm-chip{ cursor: pointer;

  padding: 4px 10px;

  font-size: 12px; line-height: 1; color: #3b5bfd;

  background: #eef2ff;
  border: none; border-radius: 999px;
}
.pm-chip:hover{ background:#e6ebff; }

/* 覆盖 MindTree 内部连线样式，让颜色更柔和 */
:deep(.mindtree__links .mindtree__link){ stroke: #dbe1ff; stroke-width: 2px; }

/* 画布背景略偏冷色 */
.mind{ background: #fafbff; }

/* 小屏压缩节点高度 */
@media (width <= 640px){
  :deep(.mindtree__node){ height: 52px !important; }
}
</style>
