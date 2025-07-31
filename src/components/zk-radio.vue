<template>
  <el-radio-group v-model="radioValue" :size="size" v-bind="$attrs">
    <el-radio v-for="item in options" :key="item.value" :value="item.value" :disabled="item.disabled">
      {{ item.label }}
    </el-radio>
  </el-radio-group>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: null,
    required: true,
  },
  options: {
    type: [Array, Object],
    default: () => [],
    required: true,
  },
  size: {
    type: String,
    default: 'default',
    validator(value) {
      return ['large', 'default', 'small'].includes(value as string)
    },
  },
})

const emit = defineEmits(['update:modelValue'])
const radioValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
</script>

<style scoped lang="scss"></style>
