<template>
  <el-collapse
    ref="ElCollapseRef"
    v-model="activeNames"
    :accordion="accordion"
    :expand-icon-position="expandIconPosition"
  >
    <el-collapse-item v-for="level in data" :key="level.id" :name="level.id">
      <template #title>
        <span>{{ level.label }}</span>
      </template>
      <template v-if="!level.children || level.children.length === 0"> {{ level.label }}最后一层</template>
      <template v-else>
        <div v-for="item in level.children" :key="item.id">
          {{ item.label }}
        </div>
      </template>
    </el-collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
/**
 * @description 嵌套折叠面板
 * @param {boolean} modelValue 打开项
 * @param {Record<string, any>[]} data 折叠配置项
 * @param {boolean} accordion 是否手风琴模式
 * @param {'right' | 'left'} expandIconPosition 展开图标位置
 */
import { ref, computed } from 'vue'
import { CollapseInstance } from 'element-plus'

interface ZkCollapseProps {
  modelValue: boolean
  data?: Record<string, any>[]
  accordion?: boolean
  expandIconPosition?: 'right' | 'left'
}

const props = withDefaults(defineProps<ZkCollapseProps>(), {})

const emit = defineEmits(['update:modelValue'])
const ElCollapseRef = ref<CollapseInstance>()

const activeNames = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

defineExpose({ ElCollapseRef })
</script>

<style scoped lang="scss"></style>
