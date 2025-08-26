<template>
  <div class="form-configurator">
    <!-- 表单类型选择 -->
    <zk-select v-model="selectedType" :options="typeOptions" placeholder="请选择表单类型"></zk-select>

    <!-- 数字输入框配置表单 -->
    <zk-form
      v-if="selectedType === 'numberInput'"
      v-model:form-config="numberInputConfig"
      v-model:form-data="numberInputData"
      :rules="numberInputRules"
      inline
      label-width="70"
      style="margin-top: 14px"
    ></zk-form>

    <!-- 选择框配置表单 -->
    <div v-if="selectedType === 'select'" class="select-config-container">
      <el-form>
        <el-form-item v-for="(item, index) in selectOptions" :key="item.id" class="select-option-item">
          <el-form-item class="form-item-inner" label="标签名">
            <zk-input v-model="item.label" placeholder="请输入标签名"></zk-input>
          </el-form-item>
          <el-form-item class="form-item-inner" label="值">
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
import { ref, reactive, watch, useId, onMounted } from 'vue'
import { Close, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
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

const emit = defineEmits<{
  'update:model-value': [value: string]
}>()
/* -----基础配置----- */
// 表单类型选择相关
const selectedType = ref<string>('')
const typeOptions = ref([
  { label: '数字输入框', value: 'numberInput' },
  { label: '选择框', value: 'select' },
])
/* -----数字输入框配置----- */
// 配置项结构
const numberInputConfig = ref([
  {
    prop: 'min',
    label: '最小值',
    type: 'numberInput',
    config: { controls: false, align: 'left' },
  },
  {
    prop: 'max',
    label: '最大值',
    type: 'numberInput',
    config: { controls: false, align: 'left' },
  },
  {
    prop: 'step',
    label: '步长',
    type: 'numberInput',
    config: { controls: false, align: 'left' },
  },
])
// 表单数据
const numberInputData = reactive<NumberInputFormData>({
  min: 0,
  max: 10,
  step: 1,
})
// 验证规则
const numberInputRules = {
  min: [
    {
      validator: (_: any, value: any, callback: any) => {
        if (value === '') return callback(new Error('该项不能为空'))
        if (+value > +numberInputData.max) return callback(new Error('最小值不能大于最大值'))
        callback()
      },
      trigger: 'blur',
    },
  ],
  max: [
    {
      validator: (_: any, value: any, callback: any) => {
        if (value === '') return callback(new Error('该项不能为空'))
        if (+value < +numberInputData.min) return callback(new Error('最大值不能小于最小值'))
        callback()
      },
      trigger: 'blur',
    },
  ],
  step: [
    {
      validator: (_: any, value: any, callback: any) => {
        if (value === '') return callback(new Error('该项不能为空'))
        if (+value <= 0) return callback(new Error('步长必须大于0'))
        callback()
      },
      trigger: 'blur',
    },
  ],
}
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
    value: null,
    config: { ...numberInputData },
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

onMounted(() => {
  if (props.modelValue) {
    try {
      const config = JSON.parse(props.modelValue)
      selectedType.value = config.type
      // 初始化配置
      if (config.type === 'select') {
        initSelectConfig(config as SelectConfig)
      } else if (config.type === 'numberInput') {
        initNumberInputConfig(config as NumberInputConfig)
      }
    } catch (error) {
      console.error('解析模型值失败:', error)
    }
  }
})

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
      id: useId(),
    }))
  } else {
    selectOptions.value = getDefaultSelectOptions()
  }
}
// 获取默认选择框选项，默认2个选项
const getDefaultSelectOptions = (): SelectFormItem[] => {
  return Array.from({ length: 2 }, () => ({
    id: useId(),
    label: '',
    value: null,
  }))
}
// 添加选项
const addOption = (index: number) => {
  selectOptions.value.splice(index + 1, 0, {
    id: useId(),
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

/* 监听与响应式处理 - 放在工具函数之后 */
// 监听表单类型变化
watch(
  () => selectedType.value,
  (newType, oldType) => {
    // 保存/恢复选择框选项
    if (oldType === 'select' && newType !== 'select') {
      savedSelectOptions.value = [...selectOptions.value]
    } else if (newType === 'select') {
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
</script>

<style scoped lang="scss">
.form-configurator {
  padding: 16px;
}

.select-config-container {
  margin-top: 12px;
}

.select-option-item {
  margin-bottom: 12px;
}

.form-item-inner {
  margin-right: 12px;
}

.icon-btn {
  cursor: pointer;
  margin-right: 8px;
}
</style>
