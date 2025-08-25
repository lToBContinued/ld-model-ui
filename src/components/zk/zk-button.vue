<template>
  <el-button ref="ElButtonRef" v-bind="props">
    <template #default>
      <slot></slot>
    </template>
    <template v-if="icon" #icon>
      <zk-icon :icon="icon" :element-icon="elementIcon"></zk-icon>
    </template>
  </el-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ButtonInstance, ButtonProps } from 'element-plus'

interface ZkButtonProps extends Partial<ButtonProps> {
  elementIcon?: boolean
  icon?: any
}

const props = withDefaults(defineProps<ZkButtonProps>(), {
  elementIcon: true,
  icon: null,
})

const ElButtonRef = ref<ButtonInstance>()

defineExpose({ ElButtonRef })
</script>

<style scoped lang="scss"></style>
