<template>
  <div class="form-configurator">
    <div>
      <zk-select
        v-model="selectedType"
        :options="typeOptions"
        placeholder="请选择表单类型"
        width="200px"
        @clear="clearFormConfig"
      ></zk-select>
    </div>
    <number-input-generator
      v-if="selectedType === 'numberInput'"
      ref="numberInputGeneratorRef"
      v-model="numberInputConfig"
    ></number-input-generator>
    <select-generator
      v-else-if="selectedType === 'select'"
      ref="selectGeneratorRef"
      v-model="selectConfig"
    ></select-generator>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, shallowRef, nextTick } from 'vue'
import { DefineProps } from '@/components/formConfigurator/types.ts'
import SelectGenerator from '@/components/formConfigurator/select-generator.vue'
import NumberInputGenerator from '@/components/formConfigurator/number-input-generator.vue'

// 父组件传递的props
const props = withDefaults(defineProps<DefineProps>(), {
  modelValue: '',
  indicatorId: 0,
})

const emit = defineEmits<{
  'update:modelValue': [value: NullType<string>]
}>()
const numberInputGeneratorRef = shallowRef<InstanceType<typeof NumberInputGenerator>>()
const selectGeneratorRef = shallowRef<InstanceType<typeof SelectGenerator>>()
const selectedType = ref<'numberInput' | 'select' | ''>('')
const typeOptions = ref([
  { label: '数字输入框', value: 'numberInput' },
  { label: '选择框', value: 'select' },
])
const numberInputConfig = ref({
  min: 0,
  max: 0,
  step: 0,
  value: null,
})
const selectConfig = ref({
  options: [
    {
      label: null,
      value: null,
    },
    {
      label: null,
      value: null,
    },
  ],
})
let isClearing = false // 是否是手动清除配置操作

const getFormConfig = () => {
  if (selectedType.value === 'numberInput') {
    return numberInputConfig.value
  } else if (selectedType.value === 'select') {
    return selectConfig.value
  }
}
/**
 * @description 发送配置
 * @param {any} config
 */
const emitConfig = (config: any) => {
  if (isClearing) return
  const data = {
    prop: `${props.indicatorId}`,
    type: selectedType.value,
    config,
  }
  emit('update:modelValue', JSON.stringify(data))
}
/**
 * @description 重置配置
 */
const resetConfig = () => {
  numberInputConfig.value = {
    min: 0,
    max: 0,
    step: 0,
    value: null,
  }
  selectConfig.value = {
    options: [
      {
        label: null,
        value: null,
      },
      {
        label: null,
        value: null,
      },
    ],
  }
}
/**
 * @description 校验配置
 */
const validatorConfig = async () => {
  await numberInputGeneratorRef.value?.verifyNumberInputConfig()
}
/**
 * @description 清除配置
 */
const clearFormConfig = async () => {
  isClearing = true
  emit('update:modelValue', null)
  await nextTick()
  isClearing = false
}

// 获取配置
watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) {
      selectedType.value = ''
    } else {
      const configParse = JSON.parse(newVal)
      selectedType.value = configParse.type
      if (configParse.type === 'numberInput') {
        numberInputConfig.value = configParse.config
      } else if (configParse.type === 'select') {
        selectConfig.value = configParse.config
      }
    }
  },
  { immediate: true },
)
// 切换表单类型时重置配置
watch(
  () => selectedType.value,
  (newVal) => {
    if (!newVal) resetConfig()
  },
)
// 生成数字输入框配置
watch(
  () => numberInputConfig.value,
  (newVal) => {
    emitConfig(newVal)
  },
  { deep: true },
)
// 生成选择框配置
watch(
  () => selectConfig.value,
  (newVal) => {
    emitConfig(newVal)
  },
  { deep: true },
)

defineExpose({ getFormConfig, validatorConfig })
</script>

<style scoped lang="scss"></style>
