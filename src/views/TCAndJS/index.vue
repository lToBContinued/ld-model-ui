<template>
  <div class="TCAndJS">
    <module-title></module-title>
    <zk-dialog :model-value="isShow" @close="closeDialog"></zk-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isShow = ref(true)

const closeDialog = () => {
  isShow.value = false
}
</script>

<style scoped lang="scss"></style>
