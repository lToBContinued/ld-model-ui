<template>
  <el-collapse class="scheme-collapse">
    <el-collapse-item v-for="item in tree" :key="item.indicatorId">
      <template #title>
        <div class="title-wrapper">
          <span class="title">{{ item.indicatorName }}</span>
          <zk-button size="small" @click.stop="openAlgorithmDialog(item)">指标算法配置</zk-button>
        </div>
      </template>
      <div :class="`content-${item.level! + 1}`">
        <span :class="`desc-${item.level! + 1}`" v-if="item.indicatorDesc">{{ item.indicatorDesc }}</span>
        <scheme-collapse v-if="item.children && item.children.length > 0" v-model="item.children"></scheme-collapse>
      </div>
    </el-collapse-item>
  </el-collapse>
  <zk-dialog
    v-model="algorithmDialogShow"
    @cancel="closeAlgorithmDialog"
    @close="closeAlgorithmDialog"
    @confirm="confirmAlgorithm"
  >
    <template #title>
      <span style="font-size: 18px">指标算法配置</span>
    </template>
  </zk-dialog>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import { SchemeIndicatorConfigItem } from '@/views/systemManage/types.ts'

interface DefineProps {
  modelValue?: SchemeIndicatorConfigItem[]
  indicatorOptions?: { label: string; value: number }[]
}

const props = withDefaults(defineProps<DefineProps>(), {})
const emit = defineEmits<{
  'model-value': [value: SchemeIndicatorConfigItem[]]
}>()
const tree = ref<SchemeIndicatorConfigItem[]>(props.modelValue!)
const currentIndicator = ref<SchemeIndicatorConfigItem>()
const algorithmDialogShow = ref(false)

watch(
  () => props.modelValue,
  (newVal) => {
    tree.value = newVal as SchemeIndicatorConfigItem[]
  },
  { deep: true },
)

// 打开指标算法配置弹窗
const openAlgorithmDialog = (item: SchemeIndicatorConfigItem) => {
  currentIndicator.value = item
  algorithmDialogShow.value = true
}
const closeAlgorithmDialog = () => {
  algorithmDialogShow.value = false
}
// 保存算法配置
const confirmAlgorithm = () => {
  // TODO: 保存算法配置
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
