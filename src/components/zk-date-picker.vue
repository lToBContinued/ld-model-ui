<template>
  <el-date-picker
    ref="ElDatePickerRef"
    v-model="date"
    :style="{ width }"
    :size="size"
    :type="type"
    :format="format"
    :placeholder="placeholder"
    :default-time="defaultTime"
    :default-value="defaultValue"
    :disabled="disabled"
    :readonly="readonly"
    :clearable="clearable"
    v-bind="$attrs"
  ></el-date-picker>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { DatePickerInstance } from 'element-plus'

interface ZkDatePickerProps {
  modelValue: number | string | object | Date | [Date, Date] | [string, string]
  width?: string
  size?: 'large' | 'default' | 'small'
  type?: 'year' | 'month' | 'date' | 'datetime' | 'week' | 'datetimerange' | 'daterange'
  format?: string
  placeholder?: string
  defaultValue?: Date | [Date, Date]
  defaultTime?: Date | [Date, Date]
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
}

const props = withDefaults(defineProps<ZkDatePickerProps>(), {
  modelValue: '',
  width: '100%',
  size: 'small',
  type: 'date',
  format: 'YYYY-MM-DD HH:mm:ss',
  placeholder: '选择日期时间',
  disabled: false,
  readonly: false,
  clearable: true,
})

const emit = defineEmits(['update:modelValue'])
const ElDatePickerRef = ref<DatePickerInstance>()
const date = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

defineExpose({ ElDatePickerRef })
</script>

<style scoped lang="scss"></style>
