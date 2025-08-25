<template>
  <el-collapse class="scheme-collapse">
    <el-collapse-item v-for="item in tree" :key="item.indicatorId">
      <template #title>
        <div class="title-wrapper">
          <span class="title">{{ item.indicatorName }}</span>
          <div style="display: flex">
            <zk-button size="small" @click.stop="openAddChildIndicatorDialog(item)">添加子指标 </zk-button>
            <zk-button type="danger" link @click.stop="removeNode(item)">删除</zk-button>
          </div>
        </div>
      </template>
      <div :class="`content-${item.level! + 1}`">
        <span :class="`desc-${item.level! + 1}`" v-if="item.indicatorDesc">{{ item.indicatorDesc }}</span>
        <scheme-collapse v-if="item.children && item.children.length > 0" v-model="item.children"></scheme-collapse>
      </div>
    </el-collapse-item>
  </el-collapse>
  <zk-dialog
    v-model="addChildIndicatorDialogShow"
    width="500px"
    @cancel="closeAddChildIndicatorDialog"
    @close="closeAddChildIndicatorDialog"
    @confirm="confirmAddChildIndicatorDialog"
    @open="addChildIndicatorDialogOpen"
  >
    <template #title>
      <span style="font-size: 18px">添加子指标</span>
    </template>
    <zk-form
      ref="addChildIndicatorRef"
      v-model:form-data="addChildIndicatorFormData"
      :form-config="addChildIndicatorFormConfig"
      label-width="80"
    ></zk-form>
  </zk-dialog>
</template>

<script setup lang="ts">
import { watch, ref, reactive } from 'vue'
import { AddSecondIndicatorFormConfigItem, SchemeIndicatorConfigItem } from '@/views/assessTargetSystem/types.ts'
import ZkForm from '@/components/zk/zk-form.vue'
import { getIndicatorAndDescendantsApi } from '@/api/indicatorManage/index.ts'

interface DefineProps {
  modelValue?: SchemeIndicatorConfigItem[]
  indicatorOptions?: { label: string; value: number }[]
}

const props = withDefaults(defineProps<DefineProps>(), {})
const emit = defineEmits<{
  'model-value': [value: SchemeIndicatorConfigItem[]]
}>()
const tree = ref<SchemeIndicatorConfigItem[]>(props.modelValue!)
const addChildIndicatorRef = ref<InstanceType<typeof ZkForm>>()
const addChildIndicatorDialogShow = ref(false)
const parentNode = ref<SchemeIndicatorConfigItem>()
const addChildIndicatorFormData = reactive<SchemeIndicatorConfigItem>({
  indicatorId: undefined,
  indicatorDesc: '',
})
const addChildIndicatorFormConfig = ref<AddSecondIndicatorFormConfigItem[]>([
  {
    prop: 'indicatorId',
    label: '指标名称',
    type: 'select',
    rules: [{ required: true, message: '请输入指标名称', trigger: 'blur' }],
    config: {
      options: [],
    },
  },
  {
    prop: 'indicatorDesc',
    label: '指标描述',
    type: 'input',
    config: {
      type: 'textarea',
    },
  },
])
const parentOptions = ref<{ label: string; value: number }[]>([])

watch(
  () => props.modelValue,
  (newVal) => {
    tree.value = newVal as SchemeIndicatorConfigItem[]
  },
  { deep: true },
)

const addChildIndicatorDialogOpen = async () => {
  const res = await getIndicatorAndDescendantsApi({ id: parentNode.value?.indicatorId as number })
  const indicatorIdSelectConfig = addChildIndicatorFormConfig.value.find((item) => item.prop === 'indicatorId')
  parentOptions.value = res.data!.map((item) => {
    return {
      label: item.indicatorName,
      value: item.id,
    }
  })
  indicatorIdSelectConfig!.config!.options = parentOptions.value
}
const getIndicatorName = (id: number) => {
  return parentOptions.value.find((item) => item.value === id)?.label
}
// 添加节点
const openAddChildIndicatorDialog = (node: SchemeIndicatorConfigItem) => {
  addChildIndicatorDialogShow.value = true
  parentNode.value = node
}
const confirmAddChildIndicatorDialog = async () => {
  try {
    await addChildIndicatorRef.value?.ElFormRef?.validate()
    const data = {
      level: parentNode.value!.level! + 1,
      children: [],
      ...addChildIndicatorFormData,
      indicatorName: getIndicatorName(addChildIndicatorFormData.indicatorId as number),
    }
    confirmAdd(tree.value, data)
    closeAddChildIndicatorDialog()
  } catch (e) {
    console.error(e)
  }
}
const confirmAdd = (tree: SchemeIndicatorConfigItem[], newNode: SchemeIndicatorConfigItem) => {
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].indicatorId === parentNode.value!.indicatorId) {
      if (!tree[i].children) {
        tree[i].children = []
        tree[i].children!.push(newNode)
      } else {
        tree[i].children!.push(newNode)
      }
    } else {
      confirmAdd(tree[i].children!, newNode)
    }
  }
}
const closeAddChildIndicatorDialog = () => {
  addChildIndicatorRef.value?.ElFormRef?.resetFields()
  addChildIndicatorDialogShow.value = false
}
// 删除节点
const removeNode = (node: SchemeIndicatorConfigItem) => {
  if (node.children && node.children.length > 0) {
    ElMessageBox.confirm('这个节点下有子节点，确定删除吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      confirmRemoveNode(tree.value, node.indicatorId!)
    })
  } else {
    confirmRemoveNode(tree.value, node.indicatorId!)
  }
}
const confirmRemoveNode = (tree: SchemeIndicatorConfigItem[], id: number): SchemeIndicatorConfigItem[] => {
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].indicatorId === id) {
      tree.splice(i, 1)
      return tree
    }
    if (tree[i].children && tree[i].children!.length > 0) {
      tree[i].children = confirmRemoveNode(tree[i].children!, id)
    }
  }
  return tree
}
</script>

<style scoped lang="scss">
$spacing-indent: 16px; // 缩进间距

.scheme-collapse {
  margin-top: $spacing-size2;

  .title-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .title {
      font-size: $font-size-l;
      font-weight: 500;
    }
  }

  [class^='content-'] {
    padding-top: $spacing-size1;
  }

  [class^='desc-'] {
    margin: 0 0 $spacing-size1;
    font-size: $font-size-s;
    line-height: 1.6;
    color: $main-text-color2;
  }

  // 不同级别缩进样式
  @for $i from 1 through 10 {
    .content-#{$i} {
      position: relative;
      padding-left: $i * $spacing-indent;
    }
    .desc-#{$i} {
      position: relative;
      left: -$i * $spacing-indent;
    }
  }
}

// 子级折叠面板样式
::v-deep(.el-collapse) {
  margin-top: $spacing-size1;
}

::v-deep(.el-collapse-item__content) {
  padding-bottom: $spacing-size2;
}
</style>
