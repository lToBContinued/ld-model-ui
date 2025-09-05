<template>
  <el-select
    ref="ElSelectRef"
    v-bind="$attrs"
    clearable
    v-model="selectValue"
    :placeholder="placeholder"
    :style="{ width }"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled"
    ></el-option>
  </el-select>
</template>

<script setup lang="ts">
import { shallowRef, computed } from 'vue'
import { SelectInstance } from 'element-plus'

interface ZkSelectProps {
  modelValue: string | number
  options: {
    label: string
    value: string | number
    disabled?: boolean
  }[]
  placeholder?: string
  width?: string
}

const emit = defineEmits(['update:modelValue'])
const ElSelectRef = shallowRef<SelectInstance>()
const props = withDefaults(defineProps<ZkSelectProps>(), {
  modelValue: '',
  options: () => [],
  placeholder: '请选择',
  width: '100%',
})

const selectValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

defineExpose({ ElSelectRef })
</script>

<style scoped lang="scss"></style>
