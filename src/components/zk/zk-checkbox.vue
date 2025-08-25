<template>
  <el-checkbox-group v-bind="props" v-model="checkList">
    <template v-if="checkboxButton">
      <el-checkbox-button
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled"
      ></el-checkbox-button>
    </template>
    <template v-else>
      <el-checkbox
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled"
        :border="border"
      ></el-checkbox>
    </template>
  </el-checkbox-group>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CheckboxGroupProps } from 'element-plus'

interface ZkCheckboxProps extends Partial<CheckboxGroupProps> {
  options?: {
    label: string | number
    value: string | number
    disabled?: boolean
  }[]
  checkboxButton?: boolean
  border?: boolean
}

const props = withDefaults(defineProps<ZkCheckboxProps>(), {})

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
