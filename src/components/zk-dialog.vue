<template>
  <el-dialog ref="ElDialogRef" v-bind="$attrs" :model-value="modelValue" :width="width" :close-on-click-modal="false">
    <template v-for="(val, name) in $slots" :key="name" #[name]="scopedData">
      <slot :name="name" v-bind="scopedData || {}"></slot>
    </template>
    <template #footer v-if="showFooter">
      <zk-button plain @click="emit('cancel', false)">{{ cancelText }}</zk-button>
      <zk-button :type="confirmBtnType" @click="emit('confirm')">{{ confirmText }}</zk-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DialogInstance } from 'element-plus'

interface ZkDialogProps {
  modelValue: boolean
  showFooter?: boolean
  cancelText?: string
  confirmText?: string
  confirmBtnType?: string
  width?: string
}

withDefaults(defineProps<ZkDialogProps>(), {
  modelValue: false,
  showFooter: true,
  cancelText: '取消',
  confirmText: '确定',
  confirmBtnType: 'primary',
  width: '50%',
})

const emit = defineEmits(['cancel', 'confirm'])
const ElDialogRef = ref<DialogInstance>()

defineExpose({ ElDialogRef })
</script>

<style lang="scss" scoped></style>
