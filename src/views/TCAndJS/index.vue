<template>
  <div class="TCAndJS">
    <module-title></module-title>
    <zk-card>
      <zk-form v-model:form-config="formConfig" active></zk-form>
    </zk-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const formConfig = reactive([
  {
    prop: 'name',
    label: '年龄',
  },
  {
    prop: 'name',
    label: '年龄',
  },
  {
    prop: 'name',
    label: '年龄',
  },
  {
    prop: 'name',
    label: '年龄',
  },
  {
    prop: 'name',
    label: '年龄',
  },
])
</script>

<style scoped lang="scss"></style>
