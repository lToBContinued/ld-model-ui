<template>
  <div class="container">
    <zk-drawer v-model="drawer" title="理论知识">
      <template #footer>
        <zk-button>取消</zk-button>
        <zk-button type="primary">确定</zk-button>
      </template>
    </zk-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const drawer = ref(true)
</script>

<style scoped lang="scss"></style>
