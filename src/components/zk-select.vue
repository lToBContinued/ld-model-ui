<template>
  <el-select v-bind="$attrs" clearable v-model="selectValue" :placeholder="placeholder" :style="{ width: selectWidth }">
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
  </el-select>
</template>

<script setup>
import { computed } from 'vue'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
    required: true,
  },
  options: {
    type: Array,
    default: () => [],
    required: true,
  },
  placeholder: {
    type: String,
    default: '请选择',
  },
  width: {
    type: Number,
    default: 240,
  },
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
