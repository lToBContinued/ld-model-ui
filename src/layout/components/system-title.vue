<template>
  <div class="system-title">
    <h1 class="big-title user-unselect">{{ SETTING.SYSTEM_NAME }}</h1>
  </div>
</template>

<script setup lang="ts">
import SETTING from '@/setting/index.ts'
</script>

<style scoped lang="scss">
.big-title {
  $base-height: 80px;

  width: 100%;
  height: $base-height;

  font-size: $big-title-size;
  line-height: $base-height;
  color: #fff;
  text-align: center;
}
</style>
