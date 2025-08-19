<template>
  <!-- 用一个“包起来的按钮”去打开公式编辑器。
       InputFormula 是一个弹窗组件：点击 slot 里的按钮就会打开。 -->
  <InputFormula
    ref="InputFormulaRef"
    v-bind="InputFormulaOptions"
    @confirm="handleConfirm"
  >
    <!-- v-bind="InputFormulaOptions" 把各种配置（标题、变量树、函数清单、初始值）统统传进去 -->
    <!-- @confirm="handleConfirm" 用户在编辑器里点“确认”时触发 -->
    <Button type="primary">公式编辑</Button>
  </InputFormula>
</template>

<script setup lang="ts">
import { Button } from 'ant-design-vue'
import InputFormula from '@/components/InputFormula/index.tsx' // 你的公式编辑器组件
import funcJson from '@/conf/func.json'                        // 函数/运算符清单（树形）
import { ref, reactive, watch, nextTick } from 'vue'
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8089'              // 演示：可选的后端地址（仅用于示例试算接口）

/** 父组件会传入：
 * - subtreeId：当前方案ID，用它去加载“变量树”
 * - value：当前节点已有的公式（用于初始化编辑器）
 * - evaluateOnConfirm：确认后是否顺便调后端试算一下
 */
const props = defineProps<{
  subtreeId: number
  value?: string
  evaluateOnConfirm?: boolean
}>()

/** 把最终编辑好的公式回传给父组件 */
const emit = defineEmits<{ (e:'confirm', formula: string): void }>()

/** ====== 后端 API ====== */
import { getSubtreeTree, listParamsByNode } from '@/api/subtrees' // 注意：一般不要带 .ts 后缀

/** 后端返回的参数/节点的简化类型 */
type ParamVO = { id: number; name: string; type: 1|2 }
type NodeVO  = { id: number; name: string; description?: string|null; refIndicatorId: number; children?: NodeVO[] }

/** 传给公式编辑器的“变量树”节点结构：
 * - 节点用 N{id}，参数用 P{id}，这样公式里能写 {N12} / {P305}
 */
type VarTreeNode = {
  namespace: string   // 分组名（这里用根路径的第一级名）
  label: string       // 展示用名字
  value: string       // 真正插入公式里的变量名（如 "N12" / "P305"）
  tagName: string     // 类型标记，这里都标记为 'number'
  children?: VarTreeNode[]
}

/** 根据 subtreeId 构建“变量树”：
 * 1) 拉整棵树（节点结构）
 * 2) 对每个节点拉参数列表
 * 3) 生成树形变量：节点→N{id}，其下挂该节点的参数→P{id}
 */
async function buildVariableTree(subtreeId: number): Promise<VarTreeNode[]> {
  const root: any = await getSubtreeTree(subtreeId) // 整棵方案树
  const pathNames = new Map<number,string[]>()      // 记录每个节点的“路径名数组”（用来当 namespace）
  const flat: any[] = []

  // DFS 一遍：收集所有节点，并记录路径
  ;(function dfs(n:any, path:string[]){
    flat.push(n)
    pathNames.set(n.id, path.concat(n.name))
    ;(n.children||[]).forEach((c:any)=>dfs(c, path.concat(n.name)))
  })(root, [])

  // 拉每个节点的参数列表
  const paramMap = new Map<number, any[]>()
  await Promise.all(flat.map(async n=>{
    try{
      const res:any = await listParamsByNode(n.id)
      paramMap.set(n.id, Array.isArray(res) ? res : (res?.list ?? []))
    }catch{
      paramMap.set(n.id, [])
    }
  }))

  // 把“后端树”转成“变量树”
  const toVarNode = (n:any):VarTreeNode=>{
    const path = pathNames.get(n.id) || [n.name]
    const ns = path[0] || '根' // 简单地用路径第一级作为命名空间（左侧分组）
    const node:VarTreeNode = {
      namespace: ns,
      label: n.name,
      value: `N${n.id}`,     // 节点变量：N{id}
      tagName: 'number',
      children: []
    }
    // 本节点的参数（P{id}）挂在该节点下面
    for(const p of (paramMap.get(n.id)||[])){
      node.children!.push({
        namespace: ns,
        label: p.name,
        value: `P${p.id}`,   // 参数变量：P{id}
        tagName: 'number'
      })
    }
    // 递归子节点
    for(const c of (n.children||[])) node.children!.push(toVarNode(c))
    return node
  }

  return root ? [toVarNode(root)] : []
}

/** ====== 传给 InputFormula 的“配置对象” ======
 * 这些都是响应式的：后续我们会把变量树/初始值写进去
 */
const InputFormulaRef = ref()

const InputFormulaOptions = reactive({
  modalOptions: {
    title: '公式编辑',                // 弹窗标题
    childTitle: '正在编辑当前节点的公式',
    zIndex: 3600,
    getContainer: () => document.body // Teleport 到 body，避免层级问题
  },
  formOptions: {
    title: '变量',
    treeData: [] as VarTreeNode[],    // ← 稍后填充 buildVariableTree 的结果
    showParentByNameSpace: [] as string[],
    isSearch: true                    // 左侧变量支持搜索
  },
  funcOptions: {
    title: '函数',
    treeData: funcJson,               // 右侧函数清单：从本地 json 读
    isSearch: true
  },
  explainOptions: {
    list: undefined as any            // 说明/示例区域（按你的组件需要传）
  },
  editorOptions: {
    docs: props.value || ''           // 文本编辑区初值（外部传进来的公式）
  }
})

/** 外部的 value 有变化（比如切换节点），同步到编辑器里 */
watch(() => props.value, v => {
  InputFormulaOptions.editorOptions.docs = v || ''
})

/** subtreeId 变化时重建“变量树”（首次也拉一遍） */
async function ensureVariablesLoaded() {
  if (!props.subtreeId) return
  const arr = await buildVariableTree(props.subtreeId)
  InputFormulaOptions.formOptions.treeData = arr
}
watch(() => props.subtreeId, () => { ensureVariablesLoaded() }, { immediate: true })

/** 点“确认”：
 * 1) 把公式回传给父组件
 * 2) 如果需要，顺便调用一次后端试算/校验（演示用）
 */
const handleConfirm = (formula: string) => {
  emit('confirm', formula)
  if (props.evaluateOnConfirm) {
    nextTick(() => {
      axios.post('/evaluate-with-vars', { formula, variables: {} })
        .then(r => console.log('后端计算结果：', r.data))
        .catch(e => console.error('请求失败：', e))
    })
  }
}
</script>

<style>
/* 样式按我前面写的InputFormula的组件默认样式即可，这里不做额外覆盖 */
</style>
