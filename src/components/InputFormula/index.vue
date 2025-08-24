<template>
  <!-- 触发区域（默认插槽）：不要再手动 @click，这里会接管点击 + 停止冒泡 -->
  <span class="if-trigger" @click.stop="openDialog">
    <slot />
  </span>

  <!-- 弹窗 -->
  <Modal
    :open="modalParams.open"
    :width="String((modalOptions as any)?.width ?? 1200)"
    :title="(modalOptions as any)?.title || '公式编辑'"
    :childTitle="(modalOptions as any)?.childTitle || ''"
    :zIndex="(modalOptions as any)?.zIndex ?? 3600"
    :getContainer="(modalOptions as any)?.getContainer || (() => document.body)"
    @handleOk="handleOk"
    @handleCancel="handleCancel"
  >
    <a-row :gutter="12" class="if-body">
      <!-- 左：变量 -->
      <a-col :span="5" class="panel">
        <Tree v-bind="formParams" @handleSelectNode="(n: any) => onSelectNode(0, n)" />
      </a-col>

      <!-- 中：编辑器 + Explain -->
      <a-col :span="14" class="panel">
        <div class="editor">
          <CodeEditor
            ref="editorRef"
            :entityFields="codeEditorOptions.entityFields"
            :formulaFunctions="codeEditorOptions.formulaFunctions"
            @handleTipsKeyDown="onTipsKeyDown"
          />
        </div>
        <div class="explain">
          <Explain :list="explainParams.list" />
        </div>
      </a-col>

      <!-- 右：函数 -->
      <a-col :span="5" class="panel">
        <Tree
          v-bind="funcParams"
          @handleExplain="(e: any) => (explainParams.list = e)"
          @handleReset="() => (explainParams.list = [])"
          @handleSelectNode="(n: any) => onSelectNode(1, n)"
        />
      </a-col>
    </a-row>
  </Modal>
</template>

<script setup lang="ts">
import { reactive, ref, watch, nextTick } from 'vue'
import { Row as ARow, Col as ACol, message } from 'ant-design-vue'
import Modal from '@/components/InputFormula/components/Modal.vue'
import Tree from '@/components/InputFormula/components/Tree.vue'
import Explain from '@/components/InputFormula/components/Explain.vue'
import CodeEditor from '@/components/InputFormula/components/CodeEditor/index.vue'
import * as formula from 'hot-formula-parser'

interface Options {
  [k: string]: any
}

const props = defineProps<{
  modalOptions: Options
  formOptions: Options
  editorOptions: Options
  funcOptions: Options
  explainOptions: Options
}>()
const emit = defineEmits<{ (e: 'confirm', docs: string): void }>()

/** ====== helpers ====== */
const groupByNamespace = (items: any[]) => {
  const grouped: Record<string, any[]> = {}
  ;(items || []).forEach((item: any) => {
    const ns = item.namespace || '默认'
    ;(grouped[ns] || (grouped[ns] = [])).push(item)
  })
  return Object.keys(grouped).map((ns, i) => ({ value: i, label: ns, children: grouped[ns] }))
}

const flattenOrganizationTree = (tree: any[], parentPath = '', hideNs: any[] = []) => {
  let out: any[] = []
  for (const node of tree || []) {
    let isShow = true
    if (hideNs && hideNs.length > 0) {
      if (hideNs.indexOf(node.namespace) > -1) isShow = false
    }
    const full = parentPath && !isShow ? `${parentPath}.${node.label}` : node.label
    out.push({ ...node, label: parentPath === '' ? node.label : full })
    if (node.children?.length) out = out.concat(flattenOrganizationTree(node.children, full, hideNs))
  }
  return out
}
const isNestedTree = (arr: any[]) =>
  Array.isArray(arr) && arr.some((n) => n && Array.isArray(n.children) && n.children.length > 0)

/** ====== states ====== */
const editorRef = ref<any>(null)

const codeEditorOptions = reactive({
  entityFields: flattenOrganizationTree(
    props.formOptions?.treeData || [],
    '',
    props.formOptions?.showParentByNameSpace,
  ),
  formulaFunctions: flattenOrganizationTree(props.funcOptions?.treeData || []),
})

const formParams = reactive({ ...props.formOptions, treeData: [] as any[] })
const funcParams = reactive({
  ...props.funcOptions,
  treeData: groupByNamespace(props.funcOptions?.treeData || []),
})
const explainParams = reactive({
  ...(props.explainOptions || {}),
  list: (props.explainOptions as any)?.list || [],
})
const modalParams = reactive({
  open: false,
})
const modalOptions = props.modalOptions || {}

/** ====== 同步树 → 自动补全 ====== */
function setFormTree(arr: any[]) {
  const nested = isNestedTree(arr)
  formParams.treeData = nested ? arr : groupByNamespace(arr || [])
  codeEditorOptions.entityFields = flattenOrganizationTree(arr || [], '', props.formOptions?.showParentByNameSpace)
}

setFormTree(props.formOptions?.treeData || [])
watch(
  () => props.formOptions?.treeData,
  (v: any[]) => setFormTree(v || []),
  { deep: true },
)

/** ====== 事件 ====== */
function handleOk() {
  const docs = editorRef.value?.getEditorValue?.() || ''
  if (!docs) {
    message.warning('请编辑公式内容后进行保存')
    return
  }
  const parser = new formula.Parser()
  const result = parser.parse(docs.replace(/\{.*?\}/g, '1'))
  if (result.error != null) {
    message.warning('公式校验失败，请检查公式语法')
    return
  }
  modalParams.open = false
  emit('confirm', docs)
}

function handleCancel() {
  modalParams.open = false
}

function openDialog() {
  modalParams.open = true
  nextTick(() => {
    const docs = (props.editorOptions || {})['docs'] || ''
    editorRef.value?.setEditorValue?.(docs)
  })
}

function onTipsKeyDown(e: any) {
  explainParams.list = e?.detail ? e.detail.split(' ; ') : []
}

function onSelectNode(type: 0 | 1, node: any) {
  if (type === 0) editorRef.value?.insertTag(node)
  else editorRef.value?.insertFormula(node)
}
</script>

<style scoped>
.if-trigger {
  display: inline-block;
}

.if-body {
  min-height: 520px;
}

.panel {
  background: #fff;
}

.editor {
  padding: 6px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
}

.explain {
  margin-top: 8px;
}
</style>
