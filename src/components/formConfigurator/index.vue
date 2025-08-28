<template>
  <div class="form-configurator">
    <!-- 表单类型选择 -->
    <div>
      <zk-select v-model="selectedType" :options="typeOptions" placeholder="请选择表单类型" width="200px"></zk-select>
    </div>
    <!-- 数字输入框配置表单 -->
    <number-input-generator
      v-show="selectedType === 'numberInput'"
      v-model="numberInputConfig"
    ></number-input-generator>

    <!-- 选择框配置表单 -->
    <!--<select-generator></select-generator>-->
    <!--<div v-show="selectedType === 'select'" class="select-config-container">
      <el-form>
        <div v-for="(item, index) in selectOptions" :key="item.id" class="select-option-item">
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
        </div>
        &lt;!&ndash; 无效项提示（可选，提升用户体验） &ndash;&gt;
        <div v-if="getInvalidOptionCount() > 0" class="invalid-tip">提示：未填写标签名或值的选项将不会被保存</div>
      </el-form>
    </div>-->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from 'vue'
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
import SelectGenerator from '@/components/formConfigurator/select-generator.vue'

// 父组件传递的props
const props = withDefaults(defineProps<DefineProps>(), {
  modelValue: '',
  indicatorId: 0,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
const selectedType = ref<'numberInput' | 'select' | ''>('')
const typeOptions = ref([
  { label: '数字输入框', value: 'numberInput' },
  { label: '选择框', value: 'select' },
])
const numberInputConfig = ref()
const selectConfig = ref()

const getFormConfig = () => {
  if (selectedType.value === 'numberInput') {
    return numberInputConfig.value
  } else if (selectedType.value === 'select') {
    return selectConfig.value
  }
}

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
        console.log('>>>>> file: index.vue ~ method: 2 <<<<<\n', numberInputConfig.value) // TODO: 删除
      } else if (configParse.type === 'select') {
        selectConfig.value = configParse.config
      }
    }
  },
  { immediate: true },
)
watch(
  () => numberInputConfig.value,
  (newVal) => {
    const config = {
      prop: `${props.indicatorId}`,
      type: selectedType.value,
      config: newVal,
    }
    emit('update:modelValue', JSON.stringify(config))
  },
  { deep: true },
)

defineExpose({ getFormConfig })
// // 工具函数：生成唯一ID
// const generateId = () => {
//   return `id-${Date.now()}-${Math.floor(Math.random() * 10000).toString(16)}`
// }
//
// // 向父组件发射值的事件
// const emit = defineEmits<{
//   'update:model-value': [value: string]
// }>()
//
// /* -------------------------- 基础配置：表单类型选择 -------------------------- */
//
// /* -------------------------- 选择框配置 -------------------------- */
// const selectOptions = ref<SelectFormItem[]>([])
// const savedSelectOptions = ref<SelectFormItem[]>([])
//
// // 计算属性：获取有效选项（标签名非空 + 值非null）
// const validSelectOptions = computed(() => {
//   return selectOptions.value.filter((item) => {
//     // 标签名去空格后非空，值不为null（0是有效数值，需保留）
//     return item.label.trim() !== '' && item.value !== null
//   })
// })
//
// // 辅助计算：无效选项数量（用于提示用户）
// const getInvalidOptionCount = () => {
//   return selectOptions.value.length - validSelectOptions.value.length
// }
// /**
//  * @description 配置生成与发射
//  */
// const emitConfig = () => {
//   if (!selectedType.value) return
//   const config = selectedType.value === 'numberInput' ? createNumberInputConfig() : createSelectConfig()
//   emit('update:model-value', config)
// }
// const createSelectConfig = (): string => {
//   return JSON.stringify({
//     prop: `${props.indicatorId}`,
//     type: 'select',
//     value: null,
//     config: {
//       // 只传入有效选项（过滤无效项）
//       options: validSelectOptions.value.map(({ label, value }) => ({
//         label: label.trim(), // 标签名去空格
//         value,
//       })),
//     },
//   })
// }
// /* -------------------------- 初始化函数 -------------------------- */
// const initSelectConfig = (config: SelectConfig) => {
//   if (config.config.options.length) {
//     const newOptions = config.config.options.map((item: SelectFormDataItem) => {
//       const existingItem = selectOptions.value.find((opt) => opt.label === item.label && opt.value === item.value)
//       return {
//         ...item,
//         id: existingItem ? existingItem.id : generateId(),
//       }
//     })
//     selectOptions.value = newOptions
//   } else {
//     selectOptions.value = getDefaultSelectOptions()
//   }
// }
// const getDefaultSelectOptions = (): SelectFormItem[] => {
//   return Array.from({ length: 2 }, () => ({
//     id: generateId(),
//     label: '',
//     value: null,
//   }))
// }
// const addOption = (index: number) => {
//   selectOptions.value.splice(index + 1, 0, {
//     id: generateId(),
//     label: '',
//     value: null,
//   })
// }
// const removeOption = (index: number) => {
//   if (selectOptions.value.length <= 2) {
//     ElMessage.warning('至少保留2个选项')
//     return
//   }
//   selectOptions.value.splice(index, 1)
//   emitConfig()
// }
// const verifySelectForm = async () => {
//   if (selectedType.value === 'select') {
//     if (validSelectOptions.value.length === 0) {
//       ElMessage.warning('请至少填写一个有效的选项（标签名和值都不能为空）')
//       throw new Error('请至少填写一个有效的选项（标签名和值都不能为空）')
//     }
//   }
// }
// const verifyForm = async () => {
//   await verifyNumberInputForm()
//   await verifySelectForm()
// }
//
// onMounted(() => {
//   if (props.modelValue) {
//     const config = JSON.parse(props.modelValue)
//     selectedType.value = config.type
//     if (config.type === 'select') {
//       initSelectConfig(config as SelectConfig)
//     } else if (config.type === 'numberInput') {
//       initNumberInputConfig(config as NumberInputConfig)
//     }
//   }
// })
//
// watch(
//   () => selectedType.value,
//   (newType, oldType) => {
//     if (oldType === 'select' && newType !== 'select') {
//       savedSelectOptions.value = [...selectOptions.value]
//     } else if (newType === 'select') {
//       selectOptions.value = savedSelectOptions.value.length ? savedSelectOptions.value : getDefaultSelectOptions()
//     }
//     emitConfig()
//   },
//   { immediate: true },
// )
// watch(
//   () => props.modelValue,
//   () => {
//     if (props.modelValue) {
//       const formConfig = JSON.parse(props.modelValue)
//       if (formConfig.type === 'numberInput') {
//         selectedType.value = 'numberInput'
//         numberInputConfig.value = formConfig.config
//       } else if (formConfig.type === 'select') {
//         selectedType.value = 'select'
//         selectConfig.value = formConfig.config
//       }
//     } else {
//       selectedType.value = ''
//     }
//   },
//   { immediate: true, deep: true },
// )
// watch(
//   () => numberInputData,
//   () => emitConfig(),
//   { deep: true },
// )
// watch(
//   () => selectOptions,
//   () => {
//     emitConfig()
//   },
//   { deep: true },
// )
//
// /* -------------------------- 对外暴露函数（新增verifyForm） -------------------------- */
// defineExpose({
//   verifyNumberInputForm,
//   verifySelectForm,
//   verifyForm, // 暴露合并后的验证函数，方便父组件调用
// })
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
  display: flex;
  align-items: center;
  margin-bottom: $spacing-size2;
  flex-wrap: wrap; // 防止选项过多换行溢出
}

.form-item-inner {
  margin-right: $spacing-size2;
  margin-bottom: $spacing-size1; // 换行时增加间距
}

.icon-btn {
  cursor: pointer;
  margin-right: 8px;
  font-size: 16px;
}

.invalid-tip {
  margin-top: $spacing-size1;
  color: #909399;
  font-size: 12px;
  line-height: 1.5;
}
</style>
