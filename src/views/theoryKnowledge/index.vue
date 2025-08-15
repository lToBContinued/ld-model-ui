<template>
  <div class="container">
    <zk-form v-model:form-config="formConfig" v-model:form-data="formData" label-width="100"></zk-form>
    <zk-button type="primary" @click="submit">提交</zk-button>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const formConfig = reactive([
  {
    prop: 'jsonData',
    label: 'json编辑',
    type: 'jsonEditor',
    config: {},
  },
])
const formData = reactive({
  jsonData: localStorage.getItem('json5') || '',
})
const submit = () => {
  localStorage.setItem('json5', formData.jsonData)
  console.log('>>>>> file: index.vue ~ method: submit <<<<<\n', formData.jsonData) // TODO: 删除
}
</script>

<style scoped lang="scss"></style>
