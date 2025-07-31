<template>
  <el-dialog ref="ElDialogRef" :model-value="modelValue" v-bind="$attrs" width="50%" :close-on-click-modal="false">
    <template v-for="(val, name) in $slots" :key="name" #[name]="scopedData">
      <slot :name="name" v-bind="scopedData || {}"></slot>
    </template>
    <template #footer v-if="showFooter">
      <el-button plain @click="emit('cancel', false)">{{ cancelText }}</el-button>
      <el-button :type="confirmBtnType" @click="emit('confirm')">{{ confirmText }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  // 窗口是否打开
  modelValue: {
    type: Boolean,
    default: false,
    required: true,
  },
  // 显示确定和取消按钮
  showFooter: {
    type: Boolean,
    default: true,
  },
  // 取消按钮文字
  cancelText: {
    type: String,
    default: '取消',
  },
  // 确定按钮文字
  confirmText: {
    type: String,
    default: '确定',
  },
  // 确认按钮类型
  confirmBtnType: {
    type: String,
    default: 'primary',
  },
})

const emit = defineEmits(['cancel', 'confirm'])
const ElDialogRef = ref(null)

defineExpose({ ElDialogRef })
</script>

<style lang="scss" scoped></style>
