<template>
  <el-checkbox-group v-model="checkList" v-bind="$attrs">
    <el-checkbox
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled"
    />
  </el-checkbox-group>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => {
      return []
    },
  },
  options: {
    type: Array,
    default: () => {
      return []
    },
    required: true,
  },
  size: {
    type: String,
    default: 'default',
    validator(value) {
      return ['large', 'default', 'small'].includes(value)
    },
  },
})

const emit = defineEmits(['update:modelValue'])
const checkList = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
</script>

<style scoped lang="scss"></style>
