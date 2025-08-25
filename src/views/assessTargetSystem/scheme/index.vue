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
      <div class="form-bths">
        <zk-button @click="resetSchemaBasicAssessForm">重置</zk-button>
        <zk-button type="primary" @click="submitSchemaBasicAssessForm">确定</zk-button>
      </div>
    </zk-card>
  </div>
  <assess-card v-if="assessCardHeader" style="margin-top: 24px" :header-title="assessCardHeader"></assess-card>
</template>

<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue'
import { schemaBasicAssessFormConfig } from '../configs/formConfigs.ts'
import { SchemaBasicAssessFormData } from '../types.ts'
import { getAssessSubjectOptionsApi, getParticipateUnitsSelectOptionsApi } from '@/api/schema/index.ts'
import ZkForm from '@/components/zk/zk-form.vue'
import AssessCard from '@/views/assessTargetSystem/scheme/components/assess-card.vue'

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
const assessCardHeader = ref<UndefinedType<string>>('')

watchEffect(() => {
  const subjectCode = schemaBasicAssessFormData.subject
  const subject = _schemaBasicAssessFormConfig.value.find((item) => item.prop === 'subject')
  if (subject) {
    assessCardHeader.value = subject.config?.options?.find((item) => item.value === subjectCode)?.label
  }
})

// 获取表单所有下拉框的下拉选项
const participateUnitsOptions = async () => {
  const res = await getParticipateUnitsSelectOptionsApi()
  const res2 = await getAssessSubjectOptionsApi()
  const options = res.data.map((item: any) => ({
    label: item.companyName,
    value: item.companyCode,
  }))
  const options2 = res2.data.map((item: any) => ({
    label: item.subjectName,
    value: item.subjectCode,
  }))
  const index = _schemaBasicAssessFormConfig.value.findIndex((item) => item.prop === 'participateUnits')
  const index2 = _schemaBasicAssessFormConfig.value.findIndex((item) => item.prop === 'subject')
  _schemaBasicAssessFormConfig.value[index].config!.options = options ? options : []
  _schemaBasicAssessFormConfig.value[index2].config!.options = options2 ? options2 : []
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

.form-bths {
  @include flex-center(row-center);
}
</style>
