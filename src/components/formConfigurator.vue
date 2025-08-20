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
    <el-form class="radio-form" v-if="modeType === 'radio'" v-model="radioFormData">
      <el-form-item v-for="item in radioArr" label="选项1：">
        <div class="radio-ele label">
          <span>标签&nbsp;&nbsp;&nbsp;</span>
          <zk-input v-model="radioFormData.options1.label"></zk-input>
        </div>
        <div class="radio-ele value">
          <span>值&nbsp;&nbsp;&nbsp;</span>
          <zk-input v-model="radioFormData.options1.value"></zk-input>
        </div>
      </el-form-item>
      <el-form-item>
        <zk-button type="primary" link>添加选项</zk-button>
      </el-form-item>
    </el-form>
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

const radioFormData = ref({
  options1: {
    label: '',
    value: '',
  },
})
const radioArr = ref([
  {
    label: '',
    value: '',
  },
])

// 单选框配置示例
const demo = [
  {
    prop: 'demo',
    type: 'radio',
    config: {
      options: [
        {
          label: '选项1',
          value: '1',
        },
        {
          label: '选项2',
          value: '2',
        },
      ],
    },
  },
]

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
  [modeType, () => radioFormData],
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
watch([modeType, () => radioFormData], ([newMode, newConfig]) => {}, { deep: true })
</script>

<style scoped lang="scss">
.radio-form {
  ::v-deep(.el-form-item) {
    display: flex;
    align-items: center;
  }

  .radio-ele {
    display: flex;
    align-items: center;
  }

  .label {
    margin-right: $spacing-size5;
  }
}
</style>
