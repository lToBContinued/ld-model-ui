<template>
  <div>
    <zk-cascader v-model="data" :options="options" style="width: 400px"></zk-cascader>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
const data = ref()
const options = ref([
  {
    value: 1,
    label: '选项1',
    children: [
      {
        value: 11,
        label: '选项1-1',
        children: [
          {
            value: 111,
            label: '选项1-1-1',
          },
        ],
      },
      {
        value: 12,
        label: '选项1-2',
      },
    ],
  },
  {
    value: 2,
    label: '选项2',
    children: [
      {
        value: 21,
        label: '选项2-1',
      },
    ],
  },
])

watchEffect(() => {
  console.log('>>>>> file: index.vue ~ method: data <<<<<\n', data.value) // TODO: 删除
})
</script>

<style scoped lang="scss"></style>
