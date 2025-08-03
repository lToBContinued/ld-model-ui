<template>
  <el-icon v-if="elementIcon" :size="size" :color="color">
    <component :is="icon"></component>
  </el-icon>
  <svg-icon v-else :name="icon" :size="size" :color="color"></svg-icon>
</template>

<script setup lang="ts">
interface KitIconProps {
  elementIcon?: boolean
  icon: string | object
  size?: string
  color?: string
}

withDefaults(defineProps<KitIconProps>(), {
  elementIcon: true,
  icon: '',
  size: '16',
})
</script>

<style scoped lang="scss"></style>
