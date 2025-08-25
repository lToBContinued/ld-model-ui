<template>
  <el-drawer v-model="drawer" :direction="direction" :size="size" :title="title" v-bind="$attrs">
    <template #default>
      <slot></slot>
    </template>
    <template #header>
      <slot name="header"></slot>
    </template>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ZkDrawerProps {
  modelValue: boolean
  direction?: 'rtl' | 'ltr' | 'ttb' | 'btt'
  size?: string | number
  title?: string
}

const props = withDefaults(defineProps<ZkDrawerProps>(), {
  modelValue: false,
  size: '50%',
})

const emit = defineEmits(['update:modelValue'])

const drawer = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
</script>

<style scoped lang="scss"></style>
