import { defineComponent, nextTick, reactive, ref, watch } from 'vue'
import { Row, Col, message } from 'ant-design-vue'
import Modal from '@/components/InputFormula/components/Modal.vue'
import Tree from '@/components/InputFormula/components/Tree.vue'
import Explain from '@/components/InputFormula/components/Explain.vue'
import CodeEditor from '@/components/InputFormula/components/CodeEditor/index.vue'
import style from './index.module.scss'
import * as formula from 'hot-formula-parser'

/* --------- helpers --------- */
const groupByNamespace = (items: any[]) => {
  const grouped: Record<string, any[]> = {}
  ;(items || []).forEach((item: any) => {
    const ns = item.namespace || '默认'
    if (!grouped[ns]) grouped[ns] = []
    grouped[ns].push(item)
  })
  const result: any[] = []
  Object.keys(grouped).forEach((ns, index) => {
    result.push({ value: index, label: ns, children: grouped[ns] })
  })
  return result
}

const flattenOrganizationTree = (tree: any[], parentPath = '', namespace: any[] = []) => {
  let out: any[] = []
  for (const node of tree || []) {
    let isShow = true
    if (namespace && namespace.length > 0) {
      if (namespace.indexOf(node.namespace) > -1) isShow = false
    }
    const fullPath = parentPath && !isShow ? `${parentPath}.${node.label}` : node.label
    out.push({ ...node, label: parentPath === '' ? node.label : fullPath })
    if (node.children && node.children.length > 0) {
      out = out.concat(flattenOrganizationTree(node.children, fullPath, namespace))
    }
  }
  return out
}

const isNestedTree = (arr: any[]) =>
  Array.isArray(arr) && arr.some((n) => n && Array.isArray(n.children) && n.children.length > 0)

interface Options {
  text: string
}

export default defineComponent({
  name: 'InputFormula',
  emits: ['confirm'],
  props: {
    modalOptions: { type: Object as () => Options, required: true },
    formOptions: { type: Object as () => Options, required: true },
    editorOptions: { type: Object as () => Options, required: true },
    funcOptions: { type: Object as () => Options, required: true },
    explainOptions: { type: Object as () => Options, default: { list: [] }, required: true },
  },
  setup(props, ctx) {
    /* ---------- editor ref ---------- */
    const codeEditorRef = ref()

    /* ---------- 编辑器提示数据（先声明，后续 setFormTree 会更新） ---------- */
    const codeEditorOptions = reactive({
      entityFields: flattenOrganizationTree(
        (props.formOptions as any).treeData || [],
        '',
        (props.formOptions as any).showParentByNameSpace,
      ),
      formulaFunctions: flattenOrganizationTree((props.funcOptions as any).treeData || []),
    })

    /* ---------- 左侧变量树（treeData 初始置空，交给 setFormTree） ---------- */
    const formParams = reactive({
      ...props.formOptions,
      treeData: [] as any[],
    })

    /* ---------- 右侧函数树 ---------- */
    const funcParams = reactive({
      ...props.funcOptions,
      treeData: groupByNamespace((props.funcOptions as any).treeData || []),
    })

    /* ---------- 解释器 ---------- */
    const explainParams = reactive({ ...props.explainOptions })

    /* ---------- Modal 配置 ---------- */
    const modalParams = reactive({
      open: false,
      ...props.modalOptions,
      zIndex: (props.modalOptions as any)?.['zIndex'] ?? 3600,
      getContainer: (props.modalOptions as any)?.['getContainer'] ?? (() => document.body),
    })

    /* ---------- 工具：拍平对象、替换变量并运行 ---------- */
    function flattenObject(obj: any, parentKey = '', result: any = {}) {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            flattenObject(obj[key], key, result)
          } else {
            result[key] = obj[key]
          }
        }
      }
      return result
    }

    function convertFormulaObject(data: any, f: string) {
      const newData = flattenObject(data)
      return f.replace(/\{(\w+)\}/g, (_, key) =>
        typeof newData[key] === 'string' ? `'${newData[key]}'` : newData[key],
      )
    }

    function RunFormula(data: any, str: string) {
      const parser = new formula.Parser()
      const result = parser.parse(convertFormulaObject(data, str))
      if (result.error != null) {
        message.warning('公式运行失败，请检查对象或公式')
        return false
      }
      return result.result
    }

    ctx.expose({ RunFormula })

    /* ---------- 统一设置“变量树 + 自动补全字段” ---------- */
    function setFormTree(arr: any[]) {
      const nested = isNestedTree(arr)
      formParams.treeData = nested ? arr : groupByNamespace(arr || [])

      // 自动补全字段：基于“原始树”拍平（包含参数）
      codeEditorOptions.entityFields = flattenOrganizationTree(
        arr || [],
        '',
        (props.formOptions as any).showParentByNameSpace,
      )
    }

    // 初始化一次
    setFormTree((props.formOptions as any).treeData || [])

    // 监听父组件更新（例如 FormulaButton 动态构建变量树）
    watch(
      () => (props.formOptions as any).treeData,
      (val: any[]) => setFormTree(val || []),
      { deep: true },
    )

    /* ---------- 事件 ---------- */
    const handelOk = () => {
      const docs = codeEditorRef.value.getEditorValue()
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
      ctx.emit('confirm', docs)
    }

    const handelCancel = () => {
      modalParams.open = false
    }

    const handleDialog = () => {
      modalParams.open = true
      nextTick(() => {
        codeEditorRef.value.setEditorValue(((props.editorOptions as any) || {})['docs'] || '')
      })
    }

    const handleExplain = (e: any) => {
      ;(explainParams as any)['list'] = e
    }

    const handleTipsKeyDown = (e: any) => {
      handleExplain(e.detail ? e.detail.split(' ; ') : undefined)
    }

    const handleSelectNode = (type: number, event: any) => {
      switch (type) {
        case 0:
          codeEditorRef.value.insertTag(event)
          break
        case 1:
          codeEditorRef.value.insertFormula(event)
          break
      }
    }

    const resetExplain = () => {
      ;(explainParams as any)['list'] = []
    }

    /* ---------- 渲染 ---------- */
    const { slots } = ctx
    return () => (
      <>
        {slots.default && <Row onClick={handleDialog}>{slots.default?.()}</Row>}
        <Modal {...modalParams} onHandleOk={handelOk} onHandleCancel={handelCancel}>
          <Row class={style['modal-content']}>
            <Col span={5} class={style['modal-variable']}>
              <Tree {...formParams} onHandleSelectNode={(event: any) => handleSelectNode(0, event)} />
            </Col>
            <Col span={14} class={style['modal-editor']}>
              <Row class={style['editor']}>
                {/* @ts-ignore */}
                <CodeEditor ref={codeEditorRef} {...codeEditorOptions} onHandleTipsKeyDown={handleTipsKeyDown} />
              </Row>
              <Row class={style['explain']}>
                {/* @ts-ignore */}
                <Explain {...explainParams} />
              </Row>
            </Col>
            <Col span={5} class={style['modal-func']}>
              <Tree
                {...funcParams}
                onHandleExplain={handleExplain}
                onHandleReset={resetExplain}
                onHandleSelectNode={(event: any) => handleSelectNode(1, event)}
              />
            </Col>
          </Row>
        </Modal>
      </>
    )
  },
})
