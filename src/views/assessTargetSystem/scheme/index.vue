<template>
  <div class="scheme">
    <module-title title="评估方案"></module-title>
    <zk-card>
      <template #header>
        <span class="card-header bold">评估基础数据</span>
      </template>
      <zk-form
        ref="schemaBasicAssessFormRef"
        v-model:form-config="_schemaBasicAssessFormConfig"
        v-model:form-data="schemaBasicAssessFormData"
        :rules="schemaBasicAssessFormRules"
        label-width="100"
        inline
      ></zk-form>
      <div class="schema-basic-assess-form-bths">
        <zk-button @click="resetSchemaBasicAssessForm">重置</zk-button>
        <zk-button type="primary" @click="submitSchemaBasicAssessForm">确定</zk-button>
      </div>
    </zk-card>
    <zk-card style="margin-top: 24px">
      <template #header>
        <span class="card-header bold">评估</span>
      </template>
    </zk-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { schemaBasicAssessFormConfig } from '../configs/formConfigs.ts'
import { SchemaBasicAssessFormData } from '../types.ts'
import { getParticipateUnitsSelectOptionsApi } from '@/api/assessTargetSystem/schema'
import type ZkForm from '@/components/zk-form.vue'

const schemaBasicAssessFormRef = ref<InstanceType<typeof ZkForm>>()
const _schemaBasicAssessFormConfig = ref(schemaBasicAssessFormConfig)
const schemaBasicAssessFormData = reactive<SchemaBasicAssessFormData>({
  participateUnits: '',
  trainingTime: null,
  assessTime: null,
  experts: '',
  subject: '',
})
const schemaBasicAssessFormRules: ValidFormRules<SchemaBasicAssessFormData> = {
  participateUnits: [{ required: true, message: '请选择参训单位', trigger: 'blur' }],
  trainingTime: [{ required: true, message: '请选择训练时间', trigger: 'blur' }],
  assessTime: [{ required: true, message: '请选择评估时间', trigger: 'blur' }],
  experts: [{ required: true, message: '请输入专家', trigger: 'blur' }],
  subject: [{ required: true, message: '请选择评估科目', trigger: 'blur' }],
}

// 获取参训单位下拉选项
const participateUnitsOptions = async () => {
  const res = await getParticipateUnitsSelectOptionsApi()
  const options = res.data.map((item: any) => ({
    label: item.companyName,
    value: item.code,
  }))
  const index = _schemaBasicAssessFormConfig.value.findIndex((item) => item.prop === 'participateUnits')
  _schemaBasicAssessFormConfig.value[index].config!.options = options ? options : []
}
// 提交评估基础数据表单
const submitSchemaBasicAssessForm = async () => {
  try {
    await schemaBasicAssessFormRef.value?.ElFormRef?.validate()
    console.log(schemaBasicAssessFormData)
  } catch (e) {
    console.error(e)
  }
}
// 重置评估基础数据表单
const resetSchemaBasicAssessForm = () => {
  schemaBasicAssessFormRef.value?.ElFormRef?.resetFields()
}

participateUnitsOptions()
</script>

<style scoped lang="scss">
.card-header {
  font-size: $font-size-l;
}

.schema-basic-assess-form-bths {
  @include flex-center(row-center);
}
</style>
