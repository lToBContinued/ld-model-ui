<template>
  <div class="input-wrapper">
    <span class="input-label" v-if="label">{{ label }}</span>
    <el-input-number v-model="inputValue" :style="{ width }" v-bind="$attrs" clearable></el-input-number>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ZkInputNumberProps {
  modelValue: string | number
  label?: string
  width?: string
}

const emit = defineEmits(['update:modelValue'])
const props = withDefaults(defineProps<ZkInputNumberProps>(), {
  width: '240px',
})

const inputValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
</script>

<style scoped lang="scss">
.input-wrapper {
  display: flex;
  align-items: center;
  margin-right: $spacing-size4;
}

.input-label {
  margin-right: $spacing-size2;
  font-size: $font-size-m;
  color: $sub-text-color1;
  letter-spacing: 0.2em;
}
</style>
