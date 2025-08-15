<template>
  <div class="indicatorManage">
    <zk-card>
      <el-row>
        <el-col :span="8">
          <div class="tree">
            <zk-tree :data="treeData" :active="{ append: true, edit: true, remove: true, check: true }"></zk-tree>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="other"></div>
        </el-col>
      </el-row>
    </zk-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const treeData = reactive([
  {
    id: 1,
    label: 'ld指标',
    children: [
      {
        id: 2,
        label: '一级指标',
      },
    ],
  },
])
</script>

<style scoped lang="scss">
.tree {
  width: 100%;
  border: 1px solid red;
  height: 200px;
}

.other {
  width: 100%;
  border: 1px solid red;
  height: 200px;
}

::v-deep(.el-card__body) {
  height: 100vh;
}
</style>
