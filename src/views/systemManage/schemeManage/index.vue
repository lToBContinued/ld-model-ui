<template>
  <div class="scheme-manage">
    <el-row class="user-unselect">
      <el-col :span="8">
        <div class="tree">
          <zk-button @click="addSchemeGroup" :icon="Plus" style="margin: 4px 0 0 4px"> 添加方案组 </zk-button>
          <zk-tree
            v-model:data="schemeList"
            :active="{ append: true, edit: false, remove: true, check: false }"
            :custom-props="{ label: 'schemeName' }"
            :draggable="true"
            @node-click="viewNode"
            @node-drop="dropFinish"
          ></zk-tree>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="scheme-content">
          <div class="indicator-select-wrapper">
            <div class="select-wrapper">
              <span class="label">选择指标体系</span>
              <zk-select v-model="selectIndicator" :options="indicatorOptions" style="width: 400px"></zk-select>
            </div>
            <div class="btn-group">
              <zk-button class="add-second-level" :icon="Plus" @click="addSecondLevel"> 添加二级指标 </zk-button>
              <zk-button type="primary">保存方案</zk-button>
            </div>
          </div>
          <div class="build-wrapper">
            <scheme-collapse
              v-model="buildSchemeTree"
              style="margin-top: 14px"
              @update:model-value="handelUpdate"
            ></scheme-collapse>
          </div>
        </div>
      </el-col>
    </el-row>
    <zk-dialog
      v-model="addSchemeGroupDialogShow"
      width="500px"
      @cancel="closeAddSchemeGroupDialog"
      @confirm="confirmAddSchemeGroup"
      @close="closeAddSchemeGroupDialog"
    >
      <template #header>
        <span style="font-size: 18px">添加方案组</span>
      </template>
      <zk-form
        ref="addSchemeGroupFormRef"
        v-model:form-data="addSchemeGroupFormData"
        v-model:form-config="addSchemeGroupFormConfig"
        label-width="100"
      ></zk-form>
    </zk-dialog>
    <zk-dialog
      v-model="addSecondLevelDialogShow"
      width="500px"
      @cancel="closeAddSecondLevelDialog"
      @confirm="confirmAddSecondLevel"
      @close="closeAddSecondLevelDialog"
    >
      <template #header>
        <span style="font-size: 18px">添加二级指标</span>
      </template>
      <zk-form
        ref="addSecondLevelFormRef"
        v-model:form-config="addSecondLevelFormConfig"
        v-model:form-data="addSecondLevelFormData"
        label-width="100"
      ></zk-form>
    </zk-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import ZkTree from '@/components/zk-tree.vue'
import { RenderContentContext } from 'element-plus'
import ZkForm from '@/components/zk-form.vue'
import {
  addSchemeGroupFormConfig,
  addSecondLevelFormConfig,
  indicatorOptions,
} from '@/views/systemManage/schemeManage/configs/formConfigs.ts'
import { AddSecondLevelFormData, buildSchemeTreeItem, SchemeListItem } from '@/views/systemManage/types.ts'
import SchemeCollapse from '@/views/systemManage/schemeManage/components/scheme-collapse.vue'

type Node = RenderContentContext['node']
type Data = RenderContentContext['data']

const addSchemeGroupFormRef = ref<InstanceType<typeof ZkForm>>()
const addSecondLevelFormRef = ref<InstanceType<typeof ZkForm>>()
const addSchemeGroupDialogShow = ref(false)
const addSecondLevelDialogShow = ref(false)
const selectIndicator = ref() // 选择指标体系
const schemeList = reactive<SchemeListItem[]>([
  {
    id: '1',
    schemeName: 'ld指标体系方案组',
    isLeaf: false,
    children: [
      {
        id: '1-1',
        schemeName: '方案一',
        isLeaf: true,
        children: [],
      },
    ],
  },
])
const addSchemeGroupFormData = reactive({
  schemeName: '',
  schemeDesc: '',
})
const buildSchemeTree = ref<buildSchemeTreeItem[]>([
  /*{
    id: '1',
    title: '指标1',
    desc: '指标1的描述',
    level: 1,
    children: [
      {
        id: '1-1',
        title: '指标1-1',
        desc: '指标1-1的描述',
        level: 2,
        children: [],
      },
      {
        id: '1-2',
        title: '指标1-2',
        desc: '指标1-2的描述',
        level: 2,
        children: [],
      },
    ],
  },
  {
    id: '2',
    title: '指标2',
    desc: '指标2的描述',
    level: 1,
    children: [],
  },
  {
    id: '3',
    title: '指标3',
    desc: '指标3的描述',
    level: 1,
    children: [
      {
        id: '3-1',
        title: '指标3-1',
        desc: '指标3-1的描述',
        level: 2,
        children: [
          {
            id: '3-1-1',
            title: '指标3-1-1',
            desc: '指标3-1-1的描述',
            level: 3,
            children: [],
          },
        ],
      },
    ],
  },*/
])
const addSecondLevelFormData = reactive<AddSecondLevelFormData>({
  indicatorName: '',
  indicatorDesc: '',
})

watch(
  () => schemeList,
  (newVal) => {
    console.log('>>>>> file: index.vue ~ method:  <<<<<\n', newVal) // TODO: 删除
  },
  { deep: true },
)

// 获取方案列表
const getTreeConfig = () => {}
const addSchemeGroup = () => {
  addSchemeGroupDialogShow.value = true
}
const viewNode = (data: Data, node: Node) => {
  const self = data
  const parent = node.parent?.data
  console.log('>>>>> file: index.vue ~ method: viewNode <<<<<\n', self, parent) // TODO: 删除
}
const closeAddSchemeGroupDialog = () => {
  addSchemeGroupFormRef.value?.ElFormRef?.resetFields()
  addSchemeGroupDialogShow.value = false
}
const confirmAddSchemeGroup = async () => {
  try {
    await addSchemeGroupFormRef.value?.ElFormRef?.validate()
    const newGroup = {
      id: Date.now(),
      ...addSchemeGroupFormData,
      children: [],
    } as SchemeListItem
    schemeList.push(newGroup)
    closeAddSchemeGroupDialog()
  } catch (e) {
    console.error(e)
  }
}
/**
 * @description 节点拖拽结束后回调函数
 * @param {Node} curNode 被拖拽节点对应的 Node
 * @param {Node} toNode 结束拖拽时最后进入的节点
 */
const dropFinish = (curNode: Node, toNode: Node) => {
  // TODO:发送请求更新节点并重新获方案列表
  console.log('>>>>> file: index.vue ~ method: dropFinish <<<<<\n', curNode, toNode) // TODO: 删除
}
// 添加子指标
const addSecondLevel = () => {
  addSecondLevelDialogShow.value = true
}
const closeAddSecondLevelDialog = () => {
  addSecondLevelFormRef.value?.ElFormRef?.resetFields()
  addSecondLevelDialogShow.value = false
}
const confirmAddSecondLevel = async () => {
  try {
    await addSecondLevelFormRef.value?.ElFormRef?.validate()
    const newNode = {
      id: `${Date.now()}`,
      title: addSecondLevelFormData.indicatorName,
      desc: addSecondLevelFormData.indicatorDesc,
      level: 1,
      children: [],
    }
    buildSchemeTree.value.push(newNode)
    closeAddSecondLevelDialog()
  } catch (e) {
    console.error(e)
  }
}
const handelUpdate = (val: any) => {
  buildSchemeTree.value = val
}
</script>

<style scoped lang="scss">
.scheme-content {
  width: 100%;
  height: calc(100vh - 50px - 2 * $spacing-size5);
  margin-left: $spacing-size2;
  padding: $spacing-size3;
  overflow-y: auto;

  background-color: #fff;
  border: 1px solid $border-color1;
}

.tree {
  border: 1px solid $border-color1;
}

.indicator-select-wrapper {
  display: flex;
  flex-direction: column;
  margin-bottom: $spacing-size3;

  .select-wrapper {
    margin: 0 auto;
  }

  .add-second-level {
    margin-right: auto;
  }

  .label {
    font-size: $font-size-m;
    margin-right: $spacing-size4;
    color: $sub-text-color3;
  }

  .btn-group {
    @include flex-center(row-between);
  }
}

.build-wrapper {
  .title-wrapper {
    @include flex-center(row-between);

    .title {
      font-size: $font-size-l;
    }

    ::v-deep(.el-button) {
      margin-right: $spacing-size4;
    }
  }
}

::v-deep(.el-card__body) {
  height: calc(100vh - 50px - 2 * $spacing-size5);
}
</style>
