<template>
  <el-form
    ref="numberInputFormRef"
    :model="numberInputData"
    :rules="numberInputRules"
    class="number-input-config-form"
    label-width="70px"
    style="width: 200px"
  >
    <el-form-item class="number-input-item" label="最小值" prop="min" required>
      <zk-input-number
        v-model="numberInputData.min"
        :controls="false"
        align="left"
        style="width: 100%"
        placeholder="请输入数字"
      ></zk-input-number>
    </el-form-item>
    <el-form-item class="number-input-item" label="最大值" prop="max" required>
      <zk-input-number
        v-model="numberInputData.max"
        :controls="false"
        align="left"
        style="width: 100%"
        placeholder="请输入数字"
      ></zk-input-number>
    </el-form-item>
    <el-form-item class="number-input-item" label="步长" prop="step" required>
      <zk-input-number
        v-model="numberInputData.step"
        :controls="false"
        align="left"
        style="width: 100%"
        placeholder="请输入数字"
      ></zk-input-number>
    </el-form-item>
    <el-form-item class="number-input-item" label="默认值" prop="value">
      <zk-input-number
        v-model="numberInputData.value"
        :controls="false"
        align="left"
        style="width: 100%"
        placeholder="请输入数字"
      ></zk-input-number>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, shallowRef, watch } from 'vue'
import { FormInstance } from 'element-plus'
import { NumberInputFormData } from '@/components/formConfigurator/types.ts'

interface DefineProps {
  modelValue: {
    min: number
    max: number
    step: number
    value: NullType<number>
  }
}

const props = withDefaults(defineProps<DefineProps>(), {
  modelValue: () => {
    return {
      min: 0,
      max: 0,
      step: 1,
      value: null,
    }
  },
})
const emit = defineEmits<{
  'update:modelValue': [value: DefineProps['modelValue']]
}>()
const numberInputFormRef = shallowRef<FormInstance>()
const numberInputData = ref<NumberInputFormData>({
  min: 0,
  max: 0,
  step: 0,
  value: null,
})
const numberInputRules: ValidFormRules<NumberInputFormData> = {
  min: [
    {
      validator: (_: any, value: any, callback: any) => {
        if (value === null) return callback(new Error('该项不能为空'))
        if (value > numberInputData.value.max) return callback(new Error('最小值不能大于最大值'))
        callback()
      },
      trigger: 'blur',
    },
  ],
  max: [
    {
      validator: (_: any, value: any, callback: any) => {
        if (value === null) return callback(new Error('该项不能为空'))
        if (value < numberInputData.value.min) return callback(new Error('最大值不能小于最小值'))
        callback()
      },
      trigger: 'blur',
    },
  ],
  step: [
    {
      validator: (_: any, value: any, callback: any) => {
        if (value === null) return callback(new Error('该项不能为空'))
        if (value <= 0) return callback(new Error('步长必须大于0'))
        callback()
      },
      trigger: 'blur',
    },
  ],
  value: [
    {
      validator: (_: any, value: any, callback: any) => {
        if (value === null) return callback()
        if (value < numberInputData.value.min) return callback(new Error('默认值不能小于最小值'))
        if (value > numberInputData.value.max) return callback(new Error('默认值不能大于最大值'))
        callback()
      },
      trigger: 'blur',
    },
  ],
}

const verifyNumberInputConfig = async () => {
  await numberInputFormRef.value?.validate()
}
const resetNumberInputConfig = () => {
  numberInputFormRef.value?.resetFields()
}

watch(
  () => props.modelValue,
  (newVal) => {
    console.log('>>>>> file: number-input-generator.vue ~ method: 3 <<<<<\n', newVal) // TODO: 删除
    numberInputData.value = newVal
  },
  { immediate: true, deep: true },
)
watch(
  () => numberInputData.value,
  (newVal) => {
    emit('update:modelValue', newVal)
  },
  { deep: true },
)

defineExpose({ verifyNumberInputConfig, resetNumberInputConfig })
</script>

<style scoped lang="scss">
.number-input-item {
  margin-bottom: $spacing-size2;
}
</style>
