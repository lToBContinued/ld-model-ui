<template>
  <el-tag :type="type" :closable="closable" :round="round" v-bind="$attrs">
    <template #default>
      <slot></slot>
    </template>
  </el-tag>
</template>

<script setup lang="ts">
interface ZkTagProps {
  type?: 'primary' | 'success' | 'info' | 'warning' | 'danger'
  closable?: boolean
  round?: boolean
  size?: 'large' | 'default' | 'small'
}

withDefaults(defineProps<ZkTagProps>(), {
  type: 'primary',
  closable: false,
  round: false,
  size: 'default',
})
</script>

<style scoped lang="scss"></style>
