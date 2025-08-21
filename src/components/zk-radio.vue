<template>
  <el-radio-group v-model="radioValue" :size="size" v-bind="$attrs">
    <el-radio v-for="item in options" :key="item.value" :value="item.value" :disabled="item.disabled">
      {{ item.label }}
    </el-radio>
  </el-radio-group>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ZkRadioProps {
  modelValue: string | number | boolean
  options: {
    label: string
    value: string | number
    disabled?: boolean
  }[]
  size?: '' | 'default' | 'small' | 'large'
}

const props = withDefaults(defineProps<ZkRadioProps>(), {
  options: () => [],
  size: 'default',
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
