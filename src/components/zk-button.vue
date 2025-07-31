<template>
  <el-button ref="ElButtonRef" v-bind="$attrs" :type="type">
    <template v-for="(val, name) in $slots" :key="name" #[name]>
      <slot :name="name"></slot>
    </template>
  </el-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  type: {
    type: String,
    validator: (value) => {
      return ['primary', 'success', 'warning', 'danger', ''].includes(value)
    },
    default: '',
  },
})

const ElButtonRef = ref(null)

defineExpose({ ElButtonRef })
</script>

<style scoped lang="scss"></style>
