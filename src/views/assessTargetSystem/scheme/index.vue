<template>
  <div class="scheme">
    <module-title title="评估方案"></module-title>
    <zk-card>
      <template #header>
        <p class="card-header bold">评估基础数据</p>
      </template>
      <zk-form
        v-model:form-config="schemaBasicAssessFormConfig"
        v-model:form-data="schemaBasicAssessFormData"
        label-width="100"
        inline
      ></zk-form>
    </zk-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { schemaBasicAssessFormConfigAsync } from '../configs/formConfigs.ts'
import { SchemaBasicAssessFormData } from '../types.ts'

const schemaBasicAssessFormConfig = ref()
const schemaBasicAssessFormData = reactive<SchemaBasicAssessFormData>({
  participateUnits: '',
  trainingTime: null,
  assessTime: null,
  experts: '',
  subject: '',
})

// 获取表单配置
const getSchemaBasicAssessFormConfig = async () => {
  schemaBasicAssessFormConfig.value = await schemaBasicAssessFormConfigAsync()
}

getSchemaBasicAssessFormConfig()
</script>

<style scoped lang="scss">
.card-header {
  font-size: $font-size-l;
}
</style>
