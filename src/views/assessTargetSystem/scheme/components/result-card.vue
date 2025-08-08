<template>
  <div class="result-card">
    <zk-card>
      <template #header>
        <span class="card-header bold">评估结果</span>
      </template>
      <zk-form
        ref="resultFilterFormRef"
        v-model:form-config="resultFilterFormConfig"
        v-model:form-data="resultFilterFormData"
        inline
        label-width="100"
      ></zk-form>
      <div class="form-bths">
        <zk-button @click="resetResultFilterForm">重置</zk-button>
        <zk-button ref="" type="primary" @click="submitResultFilterForm">提交筛选</zk-button>
      </div>
    </zk-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { resultFilterFormConfig } from '@/views/assessTargetSystem/configs/formConfigs.ts'
import { ResultFilterFormData } from '@/views/assessTargetSystem/types.ts'
import ZkForm from '@/components/zk-form.vue'

const resultFilterFormRef = ref<InstanceType<typeof ZkForm>>()
const resultFilterFormData = reactive<ResultFilterFormData>({
  company: '',
  experts: '',
  startDate: null,
  endDate: null,
})

const resetResultFilterForm = () => {
  resultFilterFormRef.value?.ElFormRef?.resetFields()
}
const submitResultFilterForm = () => {
  console.log('>>>>> file: result-card.vue ~ method: submitResultFilterForm <<<<<\n', resultFilterFormData)
}
</script>

<style scoped lang="scss">
.card-header {
  font-size: $font-size-l;
}

.form-bths {
  @include flex-center(row-center);

  margin-bottom: $spacing-size4;
  padding-bottom: $spacing-size4;
  border-bottom: 1px solid $border-color1;
}
</style>
