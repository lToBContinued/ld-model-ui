<template>
  <div>
    <zk-select v-model="modeType" :options="options"></zk-select>
    <zk-form
      v-if="modeType === 'numberInput'"
      v-model:form-config="inputNumberFormConfig"
      v-model:form-data="inputNumberFromData"
      :rules="inputNumberFormRules"
      inline
      label-width="70"
      style="margin-top: 14px"
    ></zk-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watchEffect, watch } from 'vue'

interface DefineProps {
  modelValue: string
  indicatorId: number
}

const props = withDefaults(defineProps<DefineProps>(), {})

const emit = defineEmits<{
  'update:model-value': [value: string]
}>()
const options = ref([
  {
    label: '数字输入框',
    value: 'numberInput',
  },
  {
    label: '单选框',
    value: 'radio',
  },
])
const inputNumberFormConfig = ref([
  {
    prop: 'min',
    label: '最小值',
    type: 'input',
  },
  {
    prop: 'max',
    label: '最大值',
    type: 'input',
  },
  {
    prop: 'step',
    label: '步长',
    type: 'input',
  },
])
const inputNumberFromData = reactive({
  min: 0,
  max: 10,
  step: 1,
})

const validateMin = (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('该项不能为空'))
  }
  if (+value > +inputNumberFromData.max) {
    callback(new Error('最小值不能大于最大值'))
  }
  callback()
}
const validateMax = (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('该项不能为空'))
  }
  if (+value < +inputNumberFromData.min) {
    callback(new Error('最大值不能小于最小值'))
  }
  callback()
}
const validateStep = (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('该项不能为空'))
  }
  if (+value <= 0) {
    callback(new Error('步长必须大于0'))
  }
  callback()
}
const inputNumberFormRules: ValidFormRules<typeof inputNumberFromData> = {
  min: [{ validator: validateMin, trigger: 'blur' }],
  max: [{ validator: validateMax, trigger: 'blur' }],
  step: [{ validator: validateStep, trigger: 'blur' }],
}

const modeType = ref(JSON.parse(props.modelValue).type)
const enterBoxConfig = ref(JSON.parse(props.modelValue))

watchEffect(() => {
  if (modeType.value === 'numberInput') {
    enterBoxConfig.value.type = 'numberInput'
  } else if (modeType.value === 'radio') {
    enterBoxConfig.value.type = 'radio'
  } else {
    enterBoxConfig.value.type = ''
  }
})

watch(
  [modeType, () => inputNumberFromData],
  ([newMode, newConfig]) => {
    if (newMode === 'numberInput') {
      const json = JSON.stringify({
        prop: `${props.indicatorId}`,
        type: 'numberInput',
        config: newConfig,
      })
      emit('update:model-value', json)
    }
  },
  { deep: true },
)
</script>

<style scoped lang="scss"></style>
