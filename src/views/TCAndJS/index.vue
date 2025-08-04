<template>
  <div class="TCAndJS">
    <module-title></module-title>
    <zk-checkbox v-model="checkboxValue" :options="checkboxOptions" border></zk-checkbox>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'

const checkboxValue = ref([])
const checkboxOptions = ref([
  {
    label: '典型目标TC',
    value: '0',
    disabled: true,
  },
  {
    label: '区域JS',
    value: '1',
  },
])

watchEffect(() => {
  console.log('>>>>> file: index.vue ~ method:  <<<<<\n', checkboxValue.value) // TODO: 删除
})
</script>

<style scoped lang="scss"></style>
