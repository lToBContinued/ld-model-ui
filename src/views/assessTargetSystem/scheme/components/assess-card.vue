<template>
  <div class="assess-card">
    <zk-card style="margin-top: 24px">
      <template #header>
        <span class="card-header bold">{{ headerTitle }}评估表</span>
      </template>
      <zk-form
        ref="assessFormDataRef"
        v-model:form-config="assessFormConfig"
        v-model:form-data="assessFormData"
        inline
        label-width="100"
      ></zk-form>
      <div class="form-bths">
        <zk-button @click="resetAssessForm">重置</zk-button>
        <zk-button type="primary" @click="submitAssessForm">提交评估</zk-button>
      </div>
    </zk-card>
  </div>
  <result-card v-if="showResult" style="margin-top: 24px"></result-card>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { assessFormConfig } from '@/views/assessTargetSystem/configs/formConfigs.ts'
import { AssessFormData } from '@/views/assessTargetSystem/types.ts'
import ZkForm from '@/components/zk/zk-form.vue'
import ResultCard from '@/views/assessTargetSystem/scheme/components/result-card.vue'

interface AssessCardProps {
  headerTitle?: string
}

const props = withDefaults(defineProps<AssessCardProps>(), {})

const assessFormDataRef = ref<InstanceType<typeof ZkForm>>()
const assessFormData = reactive<AssessFormData>({
  target: undefined,
  comprehensive: undefined,
  accuracy: undefined,
  supportive: undefined,
  remark: '',
})
const showResult = ref(false)

watch(
  () => props.headerTitle,
  () => {
    resetAssessForm()
  },
)

const resetAssessForm = () => {
  assessFormDataRef.value?.ElFormRef?.resetFields()
  showResult.value = false
}
const submitAssessForm = () => {
  console.log('>>>>> file: assess-card.vue ~ method: submitAssessForm <<<<<\n', assessFormData)
  showResult.value = true
}
</script>

<style scoped lang="scss">
.card-header {
  font-size: $font-size-l;
}

.form-bths {
  @include flex-center(row-center);
}
</style>
