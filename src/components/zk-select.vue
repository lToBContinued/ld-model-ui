<template>
  <el-select v-bind="$attrs" clearable v-model="selectValue" :placeholder="placeholder" :style="{ width: selectWidth }">
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
  </el-select>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ZkSelectProps {
  modelValue: string | number
  options: {
    label: string
    value: string | number
  }[]
  placeholder?: string
  width?: number
}

const emit = defineEmits(['update:modelValue'])
const props = withDefaults(defineProps<ZkSelectProps>(), {
  modelValue: '',
  options: () => [],
  placeholder: '请选择',
  width: 240,
})

const selectValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const selectWidth = computed(() => {
  return props.width + 'px'
})
</script>

<style scoped lang="scss"></style>
