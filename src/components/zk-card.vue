<template>
  <el-card ref="ElCardRef" v-bind="$attrs">
    <template v-for="(val, name) in $slots" :key="name" #[name]>
      <slot :name="name"></slot>
    </template>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const ElCardRef = ref(null)

defineExpose({ ElCardRef })
</script>

<style lang="scss" scoped>
.el-card {
  overflow: auto;
  height: 100%;
}

:deep(.el-card__body) {
  padding: $spacing-size3;
}
</style>
