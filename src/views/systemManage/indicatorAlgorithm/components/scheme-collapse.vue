<template>
  <el-collapse class="scheme-collapse">
    <el-collapse-item v-for="item in tree" :key="item.indicatorId">
      <template #title>
        <div class="title-wrapper">
          <span class="title">{{ item.name }}</span>
          <zk-button size="small" @click.stop="openDialog(item)">指标算法配置</zk-button>
        </div>
      </template>
      <div :class="`content-${(item.level ?? 0) + 1}`">
        <span :class="`desc-${(item.level ?? 0) + 1}`" v-if="item.indicatorDesc">{{ item.indicatorDesc }}</span>
        <scheme-collapse
          v-if="item.children?.length"
          v-model="item.children"
          :indicator-options="indicatorOptions"
          :scheme-id="schemeId"
        />
      </div>
    </el-collapse-item>
  </el-collapse>
  <!-- 放在根模板末尾，避免层级和布局干扰 -->
  <AlgorithmConfigDialog
    v-model="dlgOpen"
    :subtree-id="schemeId"
    :node="currentIndicator"
    @save="onDialogSave"
    @changed="bubbleChanged"
  />
</template>

<script setup lang="ts">
import { shallowRef, watch, ref } from 'vue'
import type { SchemeIndicatorConfigItem } from '@/views/systemManage/types'
import { ElMessage } from 'element-plus'
import { updateSubtreeNode } from '@/api/schemeManage/legacySubtree.ts' // ✅ 用节点级保存
import AlgorithmConfigDialog from './AlgorithmConfigDialog.vue'

defineOptions({ name: 'SchemeCollapse' })

interface DefineProps {
  modelValue?: SchemeIndicatorConfigItem[]
  indicatorOptions?: { label: string; value: number }[]
  schemeId?: number // subtreeId
}
const props = withDefaults(defineProps<DefineProps>(), {
  modelValue: () => [],
  indicatorOptions: () => [],
  schemeId: undefined,
})
const emit = defineEmits<{ (e: 'update:modelValue', v: SchemeIndicatorConfigItem[]): void }>()

const tree = shallowRef<SchemeIndicatorConfigItem[]>([])
const deepClone = <T,>(o: T): T => JSON.parse(JSON.stringify(o))

watch(
  () => props.modelValue,
  (v) => {
    tree.value = deepClone(v ?? [])
  },
  { immediate: true },
)

const dlgOpen = ref(false)
const currentIndicator = ref<SchemeIndicatorConfigItem | null>(null)
function openDialog(item: SchemeIndicatorConfigItem) {
  currentIndicator.value = item
  dlgOpen.value = true
}

async function onDialogSave(payload: {
  indicatorId: number
  enabled: 0 | 1
  weight: number | null
  formula: string
  params: Array<{ name: string; code: string; defaultValue: string }>
}) {
  if (!currentIndicator.value) return

  // 1) 立即更新本地树
  Object.assign(currentIndicator.value, {
    enabled: payload.enabled,
    weight: payload.weight,
    formula: payload.formula,
    params: payload.params,
  })
  emit('update:modelValue', deepClone(tree.value))

  // 2) ★ 只保存当前节点（别再整树保存）
  try {
    await updateSubtreeNode(payload.indicatorId, {
      formula: payload.formula ?? null,
      weight: payload.weight ?? null,
      enabled: payload.enabled,
    })
    ElMessage.success('已保存')
  } catch (e: any) {
    ElMessage.error(e?.message || '保存失败')
  }
}
</script>

<style scoped lang="scss">
$spacing-indent: 16px;

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

::v-deep(.el-collapse) {
  margin-top: $spacing-size1;
}

::v-deep(.el-collapse-item__content) {
  padding-bottom: $spacing-size2;
}
</style>
