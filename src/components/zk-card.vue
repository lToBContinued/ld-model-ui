<template>
  <el-card ref="ElCardRef" v-bind="props">
    <template v-for="(val, name) in $slots" :key="name" #[name]>
      <slot :name="name"></slot>
    </template>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CardProps, CardInstance } from 'element-plus'

type ZkCardProps = Partial<CardProps> & {}

const props = withDefaults(defineProps<ZkCardProps>(), {})

const ElCardRef = ref<CardInstance>()

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
