<template>
  <div class="form-configurator">
    <!-- 表单类型选择 -->
    <zk-select v-model="selectedType" :options="typeOptions" placeholder="请选择表单类型" width="200px"></zk-select>

    <!-- 数字输入框配置表单 -->
    <el-form
      ref="numberInputFormRef"
      v-if="selectedType === 'numberInput'"
      :model="numberInputData"
      :rules="numberInputRules"
      class="number-input-config-form"
      label-width="60px"
      style="width: 200px"
    >
      <el-form-item class="number-input-item" label="最小值" prop="min">
        <zk-input-number
          v-model="numberInputData.min"
          :controls="false"
          align="left"
          style="width: 100%"
        ></zk-input-number>
      </el-form-item>
      <el-form-item class="number-input-item" label="最大值" prop="max">
        <zk-input-number
          v-model="numberInputData.max"
          :controls="false"
          align="left"
          style="width: 100%"
        ></zk-input-number>
      </el-form-item>
      <el-form-item class="number-input-item" label="步长" prop="step">
        <zk-input-number
          v-model="numberInputData.step"
          :controls="false"
          align="left"
          style="width: 100%"
        ></zk-input-number>
      </el-form-item>
      <el-form-item class="number-input-item" label="默认值" prop="value">
        <zk-input-number
          v-model="numberInputData.value"
          :controls="false"
          align="left"
          style="width: 100%"
        ></zk-input-number>
      </el-form-item>
    </el-form>

    <!-- 选择框配置表单 -->
    <div v-if="selectedType === 'select'" class="select-config-container">
      <el-form>
        <el-form-item v-for="(item, index) in selectOptions" :key="item.id" class="select-option-item">
          <el-form-item class="form-item-inner" label="标签名" prop="label">
            <zk-input v-model="item.label" placeholder="请输入标签名"></zk-input>
          </el-form-item>
          <el-form-item class="form-item-inner" label="值" prop="value">
            <zk-input-number
              v-model="item.value"
              :controls="false"
              align="left"
              placeholder="请输入值"
            ></zk-input-number>
          </el-form-item>
          <el-icon class="icon-btn" color="#67c23a" @click="addOption(index)">
            <Plus />
          </el-icon>
          <el-icon v-if="selectOptions.length > 2" class="icon-btn" color="#f56c6c" @click="removeOption(index)">
            <Close />
          </el-icon>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { Close, Plus } from '@element-plus/icons-vue'
import { ElMessage, FormInstance } from 'element-plus'
import {
  DefineProps,
  NumberInputConfig,
  NumberInputFormData,
  SelectConfig,
  SelectFormDataItem,
  SelectFormItem,
} from '@/components/formConfigurator/types.ts'

const props = withDefaults(defineProps<DefineProps>(), {
  modelValue: '',
  indicatorId: 0,
})
const generateId = () => {
  return `id-${Date.now()}-${Math.floor(Math.random() * 10000).toString(16)}`
}

const emit = defineEmits<{
  'update:model-value': [value: string]
}>()
/* -----基础配置----- */
// 表单类型选择相关
const selectedType = ref<'numberInput' | 'select' | ''>('')
const typeOptions = ref([
  { label: '数字输入框', value: 'numberInput' },
  { label: '选择框', value: 'select' },
])
/* -----数字输入框配置----- */
const numberInputFormRef = ref<FormInstance>()
// 表单数据
const numberInputData = reactive<NumberInputFormData>({
  min: 0,
  max: 10,
  step: 1,
  value: null,
})
// 验证规则
const numberInputRules: ValidFormRules<NumberInputFormData> = {
  min: [
    {
      validator: (_: any, value: any, callback: any) => {
        if (value === null) return callback(new Error('该项不能为空'))
        if (value > numberInputData.max) return callback(new Error('最小值不能大于最大值'))
        callback()
      },
      trigger: 'blur',
    },
  ],
  max: [
    {
      validator: (_: any, value: any, callback: any) => {
        if (value === null) return callback(new Error('该项不能为空'))
        if (value < numberInputData.min) return callback(new Error('最大值不能小于最小值'))
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
        if (value < numberInputData.min) return callback(new Error('默认值不能小于最小值'))
        if (value > numberInputData.max) return callback(new Error('默认值不能大于最大值'))
        callback()
      },
      trigger: 'blur',
    },
  ],
}

onMounted(() => {
  if (props.modelValue) {
    const config = JSON.parse(props.modelValue)
    selectedType.value = config.type
    // 初始化配置
    if (config.type === 'select') {
      initSelectConfig(config as SelectConfig)
    } else if (config.type === 'numberInput') {
      initNumberInputConfig(config as NumberInputConfig)
    }
  }
})

/* -----选择框配置----- */
// 选择框选项数据
const selectOptions = ref<SelectFormItem[]>([])
const savedSelectOptions = ref<SelectFormItem[]>([])

/* 工具函数 - 提前定义，确保可以被watch访问 */
// 生成并发射json配置
const emitConfig = () => {
  if (!selectedType.value) return
  const config = selectedType.value === 'numberInput' ? createNumberInputConfig() : createSelectConfig()
  emit('update:model-value', config)
}
const createNumberInputConfig = (): string => {
  return JSON.stringify({
    prop: `${props.indicatorId}`,
    type: 'numberInput',
    value: numberInputData.value,
    config: {
      min: numberInputData.min,
      max: numberInputData.max,
      step: numberInputData.step,
    },
  })
}
const createSelectConfig = (): string => {
  const validOptions = selectOptions.value.filter((item) => item.label.trim() !== '' || item.value !== null)
  return JSON.stringify({
    prop: `${props.indicatorId}`,
    type: 'select',
    value: null,
    config: {
      options: validOptions.map(({ label, value }) => ({ label, value })),
    },
  })
}

/* 初始化 */
const initNumberInputConfig = (config: NumberInputConfig) => {
  numberInputData.min = config.config.min
  numberInputData.max = config.config.max
  numberInputData.step = config.config.step
}
const initSelectConfig = (config: SelectConfig) => {
  if (config.config.options.length) {
    selectOptions.value = config.config.options.map((item: SelectFormDataItem) => ({
      ...item,
      id: generateId(),
    }))
  } else {
    selectOptions.value = getDefaultSelectOptions()
  }
}
// 获取默认选择框选项，默认2个选项
const getDefaultSelectOptions = (): SelectFormItem[] => {
  const defaultArr = Array.from({ length: 2 }, () => ({
    id: generateId(),
    label: '',
    value: null,
  }))
  return defaultArr
}
// 添加选项
const addOption = (index: number) => {
  selectOptions.value.splice(index + 1, 0, {
    id: generateId(),
    label: '',
    value: null,
  })
}
const removeOption = (index: number) => {
  if (selectOptions.value.length <= 2) {
    ElMessage.warning('至少保留2个选项')
    return
  }
  selectOptions.value.splice(index, 1)
}

/* 表单校验 */
const verifyNumberInputForm = async () => {
  if (selectedType.value === 'numberInput') {
    await numberInputFormRef.value?.validate()
  }
}

/* 监听与响应式处理 - 放在工具函数之后 */
// 监听表单类型变化
watch(
  () => selectedType.value,
  (newType, oldType) => {
    // 保存/恢复选择框选项
    if (oldType === 'select' && newType !== 'select') {
      savedSelectOptions.value = [...selectOptions.value] // 缓存选择框选项
    } else if (newType === 'select') {
      // 恢复选择框选项
      selectOptions.value = savedSelectOptions.value.length ? savedSelectOptions.value : getDefaultSelectOptions()
    }
    // 生成配置
    emitConfig()
  },
  { immediate: true },
)
watch(
  () => numberInputData,
  () => emitConfig(),
  { deep: true },
)
watch(
  () => selectOptions.value,
  () => emitConfig(),
  { deep: true },
)

defineExpose({ verifyNumberInputForm })
</script>

<style scoped lang="scss">
.number-input-config-form {
  margin-top: $spacing-size3;
}

.number-input-item {
  margin-bottom: $spacing-size2;
}

.select-config-container {
  margin-top: $spacing-size3;
}

.select-option-item {
  margin-bottom: $spacing-size2;
}

.form-item-inner {
  margin-right: $spacing-size2;
}

.icon-btn {
  cursor: pointer;
  margin-right: 8px;
}
</style>
