<template>
  <!-- 按钮点开公式编辑器 -->
  <InputFormula ref="InputFormulaRef" v-bind="InputFormulaOptions" @confirm="handleConfirm">
    <el-button type="primary">公式编辑</el-button>
  </InputFormula>
</template>

<script setup lang="ts">
import { ref, reactive, watch, nextTick } from 'vue'
import InputFormula from '@/components/InputFormula/index.vue'
import funcJson from '@/conf/func.json'
import { getSubtreeTree, listParamsByNode } from '@/api/schemeManage/legacySubtree.ts'

type VarTreeNode = {
  namespace: string
  label: string
  value: string // 节点用 N{id}，参数用 P{id}
  tagName: string // 'number'
  children?: VarTreeNode[]
}

const props = defineProps<{
  subtreeId: number // 当前方案ID，用来加载“变量树”
  value?: string // 当前节点已有公式，作为编辑器初始值
  evaluateOnConfirm?: boolean // 确认时是否顺便调用后端校验计算
}>()

const emit = defineEmits<{ (e: 'confirm', formula: string): void }>()
const InputFormulaOptions = reactive({
  modalOptions: {
    title: '公式编辑',
    childTitle: '正在编辑当前节点的公式',
    zIndex: 3600,
    getContainer: () => document.body,
  },
  formOptions: {
    title: '变量',
    treeData: [] as VarTreeNode[],
    showParentByNameSpace: [] as string[],
    isSearch: true,
  },
  funcOptions: {
    title: '函数',
    treeData: funcJson,
    isSearch: true,
  },
  explainOptions: {
    list: undefined as any,
  },
  editorOptions: {
    docs: props.value || '', // 初始公式
  },
})
const InputFormulaRef = ref()

/** 外部 value 变化时，更新编辑器初值 */
watch(
  () => props.value,
  (v) => {
    InputFormulaOptions.editorOptions.docs = v || ''
  },
)

// 获取参数配置的代码
/*watch(() => props.subtreeId, ensureVariablesLoaded, { immediate: true })

/!**
 * @description 参数配置数据
 * @param { number } subtreeId 节点id
 *!/
async function buildVariableTree(subtreeId: number): Promise<VarTreeNode[]> {
  const root: any = await getSubtreeTree(subtreeId)
  const pathNames = new Map<number, string[]>()
  const flat: any[] = []

  function dfs(n: any, path: string[]) {
    flat.push(n)
    pathNames.set(n.id, path.concat(n.name))
    ;(n.children || []).forEach((c: any) => dfs(c, path.concat(n.name)))
  }

  if (root) dfs(root, [])

  const paramMap = new Map<number, any[]>()
  await Promise.all(
    flat.map(async (n) => {
      try {
        const res: any = await listParamsByNode(n.data.id)
        paramMap.set(n.id, Array.isArray(res) ? res : (res?.list ?? []))
      } catch {
        paramMap.set(n.id, [])
      }
    }),
  )
  const toVarNode = (n: any): VarTreeNode => {
    const path = pathNames.get(n.id) || [n.name]
    const ns = path[0] || '根'
    const node: VarTreeNode = {
      namespace: ns,
      label: n.name,
      value: `N${n.id}`,
      tagName: 'number',
      children: [],
    }
    for (const p of paramMap.get(n.id) || []) {
      node.children!.push({
        namespace: ns,
        label: p.name,
        value: `P${p.id}`,
        tagName: 'number',
      })
    }
    for (const c of n.children || []) node.children!.push(toVarNode(c))
    return node
  }

  return root ? [toVarNode(root)] : []
}

/!** subtreeId 变化时，刷新变量树（首次也要拉） *!/
async function ensureVariablesLoaded() {
  if (!props.subtreeId) return
  const arr = await buildVariableTree(props.subtreeId)
  InputFormulaOptions.formOptions.treeData = arr
}*/

/** 确认：把公式回传给外面；是否后端试算由父组件控制 */
const handleConfirm = (formula: string) => {
  emit('confirm', formula)
  if (props.evaluateOnConfirm) {
    nextTick(() => {
      // do optional evaluate...
    })
  }
}
</script>

<style scoped></style>
