<template>
  <div>
    children: {{ num }}
    <el-button @click="num++">++++</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
const num = ref(0)
const emit = defineEmits(['update:count'])

watch(num, (newVal) => {
  emit('update:count', newVal)
})
</script>

<style scoped lang="scss"></style>
