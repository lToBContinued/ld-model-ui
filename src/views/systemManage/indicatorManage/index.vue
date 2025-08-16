<template>
  <div class="indicatorManage">
    <zk-card>
      <el-row>
        <el-col :span="10">
          <div class="tree">
            <zk-tree
              ref="ZkTreeRef"
              v-model:data="rootTree"
              :active="{ append: true, edit: false, remove: true, check: false }"
              :load="getTreeConfig"
              lazy
              @node-click="viewNode"
            ></zk-tree>
          </div>
        </el-col>
        <el-col :span="14">
          <div class="panel">
            <zk-form v-model:form-data="formData" v-model:form-config="formConfig" label-width="80"></zk-form>
            <zk-button type="primary" @click="saveConfig" style="margin-left: auto">保存配置</zk-button>
          </div>
        </el-col>
      </el-row>
    </zk-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, ref } from 'vue'
import { RenderContentContext } from 'element-plus'
import indicatorTemplate from './indicatorTemplate.json'
import type { LoadFunction } from 'element-plus'
import { getIndicatorDetail, getIndicatorTree } from '@/api/indicatorManage'
import ZkTree from '@/components/zk-tree.vue'

type Node = RenderContentContext['node']
type Data = RenderContentContext['data']

const ZkTreeRef = ref<InstanceType<typeof ZkTree>>()
const rootTree = reactive([
  {
    id: '0',
    label: 'ld指标根节点',
  },
])
const formConfig = [
  {
    prop: 'parent',
    label: '父级指标',
    type: 'input',
    config: {
      disabled: true,
      style: {
        width: '240px',
      },
    },
  },
  {
    prop: 'indicatorName',
    label: '指标名称',
    type: 'input',
    config: {
      style: {
        width: '240px',
      },
    },
  },
  {
    prop: 'description',
    label: '指标描述',
    type: 'input',
    config: {
      type: 'textarea',
    },
  },
  {
    prop: 'type',
    label: '节点类型',
    type: 'radio',
    config: {
      options: [
        { label: '录入节点', value: '0' },
        { label: '计算节点', value: '1' },
      ],
    },
  },
  {
    prop: 'config',
    label: '指标配置',
    type: 'jsonEditor',
  },
]
const formData = reactive({
  parent: '',
  indicatorName: '',
  description: '',
  type: '',
  config: JSON.stringify(indicatorTemplate, null, 2),
})

watch(
  () => rootTree,
  (newVal) => {
    console.log('>>>>> file: index.vue ~ method:  <<<<<\n', newVal) // TODO: 删除
  },
  { deep: true },
)

// 获取树
const getTreeConfig: LoadFunction = async (node, resolve, reject) => {
  if (node.level === 0) {
    return resolve(rootTree)
  }
  if (node.level >= 1) {
    const res = await getIndicatorTree({ nodeId: node.data.id })
    if (res.status === 200) {
      return resolve(res.data)
    } else {
      ElMessage.error('节点加载失败，请重试')
      return reject()
    }
  }
}
// 查看节点
const viewNode = async (data: Data, node: Node) => {
  const self = data
  const parent = node.parent?.data
  const res = await getIndicatorDetail({ nodeId: self.id })
  const { indicatorName, description, type, config, formConfig } = res.data
  formData.parent = parent?.label
  formData.indicatorName = indicatorName
  formData.description = description
  formData.type = type
  formData.config = config
  formData.config = formConfig
}
// 保存配置
const saveConfig = () => {
  console.log('>>>>> file: index.vue ~ method: submit <<<<<\n', formData) // TODO: 删除
}
</script>

<style scoped lang="scss">
.tree {
  overflow-y: auto;
  width: 100%;
  height: 600px;
  border: 1px solid $border-color1;
}

.panel {
  display: flex;
  flex-direction: column;
  width: 100%;
}

::v-deep(.el-card__body) {
  height: calc(100vh - 50px - 2 * $spacing-size5);
}

::v-deep(.el-tree-node__content) {
  height: 40px;
}
</style>
