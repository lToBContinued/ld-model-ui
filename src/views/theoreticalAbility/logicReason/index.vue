<template>
  <div class="logicReason">
    <zk-card> 逻辑推理</zk-card>
    <el-button @click="handelClick">查询</el-button>
  </div>
</template>

<script setup lang="ts">
import { testApi } from '@/api/test.ts'

const handelClick = async () => {
  const res = await testApi()
  console.log('>>>>> file: index.vue ~ method: handelClick <<<<<\n', res) // TODO: 删除
}
</script>

<style scoped lang="scss"></style>
