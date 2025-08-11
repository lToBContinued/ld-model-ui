<template>
  <div>
    <module-title title="用户管理"></module-title>
    <zk-card>
      <zk-table :columns="userManageTableColumns"></zk-table>
    </zk-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { userManageTableColumns } from '@/views/systemManage/userManage/configs/tableConfigs.ts'

const state = reactive({
  totalData: [],
  total: 0,
  currentPage: 1,
  pageSize: 10,
})
</script>

<style scoped lang="scss"></style>
