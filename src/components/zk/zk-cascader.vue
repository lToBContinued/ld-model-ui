<template>
  <el-cascader
    ref="ElCascaderRef"
    v-model="data"
    :clearable="clearable"
    :disabled="disabled"
    :options="options"
    :placeholder="placeholder"
    :separator="separator"
    :size="size"
    :style="{ width }"
    v-bind="$attrs"
  ></el-cascader>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { CascaderInstance, CascaderOption } from 'element-plus'

interface DefineProps {
  modelValue: string | number | string[] | number[]
  options: CascaderOption[]
  width?: string
  clearable?: boolean
  separator?: string
  disabled?: boolean
  placeholder?: string
  size?: 'large' | 'default' | 'small'
}

const props = withDefaults(defineProps<DefineProps>(), {
  width: '100%',
  clearable: true,
})

const ElCascaderRef = ref<CascaderInstance>()
const emit = defineEmits<{
  'update:model-value': [value: DefineProps['modelValue']]
}>()
const data = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:model-value', val)
  },
})

defineExpose({ ElCascaderRef })
</script>

<style scoped lang="scss"></style>
