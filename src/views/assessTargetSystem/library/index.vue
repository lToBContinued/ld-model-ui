<template>
  <div class="library">
    <module-title title="可用指标库"></module-title>
    <zk-tree :data="metricsTreeData" :active="{ check: true }" lazy :load="loadNodes" @view-node="viewNode"></zk-tree>
    <zk-drawer v-model="drawerShow" :title="selectedMetrics.label">
      <zk-form v-model:form-config="drawerFormConfig" v-model:form-data="drawerFormData"></zk-form>
    </zk-drawer>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { RenderContentContext } from 'element-plus'
import type { LoadFunction } from 'element-plus'
type Node = RenderContentContext['node']
type Data = RenderContentContext['data']

const metricsTreeData = reactive([
  {
    id: 1,
    label: '一级指标-处置效果',
    children: [
      {
        id: 11,
        label: '二级指标-送命指标',
      },
      {
        id: 12,
        label: '二级指标-及时性',
      },
      {
        id: 13,
        label: '二级指标-准确性',
      },
      {
        id: 14,
        label: '二级指标-连续性',
      },
      {
        id: 15,
        label: '二级指标-完整性',
      },
      {
        id: 16,
        label: '二级指标-可靠性',
      },
    ],
  },
])
const selectedMetrics = ref<Data>([])
const drawerShow = ref(false)
const drawerFormConfig = reactive({})
const drawerFormData = reactive({})

const viewNode = (node: Node, data: Data) => {
  drawerShow.value = true
  selectedMetrics.value = data
}
const loadNodes: LoadFunction = (node, resolve) => {
  if (node.level === 0) {
    return resolve([
      {
        id: 1,
        isLeaf: false,
        label: '一级指标-处置效果',
      },
    ])
  }
  if (node.data.isLeaf) return resolve([])

  setTimeout(() => {
    const data = [
      {
        id: 11,
        isLeaf: true,
        label: '二级指标-clyq',
      },
      {
        id: 12,
        isLeaf: true,
        label: '二级指标-及时性',
      },
      {
        id: 13,
        isLeaf: true,
        label: '二级指标-准确性',
      },
      {
        id: 14,
        isLeaf: true,
        label: '二级指标-连续性',
      },
      {
        id: 15,
        isLeaf: true,
        label: '二级指标-完整性',
      },
      {
        id: 16,
        isLeaf: true,
        label: '二级指标-可靠性',
      },
    ]

    resolve(data)
  }, 500)
}
</script>

<style scoped lang="scss"></style>
