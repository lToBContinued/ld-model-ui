<template>
  <div class="scheme-manage">
    <zk-card></zk-card>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
::v-deep(.el-card__body) {
  height: calc(100vh - 50px - 2 * $spacing-size5);
}
</style>
