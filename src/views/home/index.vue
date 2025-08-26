<template>
  <div>
    <form-configurator v-model="labelFormConfig" :indicator-id="111"></form-configurator>
    <zk-button type="primary" @click="submit">提交</zk-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const labelFormConfig = ref('')

const submit = () => {
  console.log('>>>>> file: index.vue ~ method: submit <<<<<\n', labelFormConfig.value) // TODO: 删除
}
</script>

<style scoped lang="scss"></style>
