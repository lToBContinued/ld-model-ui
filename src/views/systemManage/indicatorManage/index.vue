<template>
  <div class="indicatorManage">
    <zk-card>
      <el-row>
        <el-col :span="6">
          <div class="tree">
            <zk-tree></zk-tree>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="other"></div>
        </el-col>
      </el-row>
    </zk-card>
  </div>
</template>

<script setup lang="ts"></script>

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
</style>
