<template>
  <div>
    <el-form ref="ElFormRef" v-bind="$attrs" :rules="rules" :model="_formData" :label-width="_labelWidth">
      <el-row :gutter="gutter" :justify="inline ? 'start' : 'center'">
        <el-col v-for="item in _formConfig" :key="item.prop" v-bind="_inline">
          <el-form-item :label="item.label" :prop="item.prop" :rules="item.rules">
            <!-- 下拉框 -->
            <zk-select v-model="_formData[item.prop]" v-if="item.type === 'select'" v-bind="item.config"></zk-select>
            <!-- 时间选择器 -->
            <zk-date-picker
              v-else-if="item.type === 'datePicker'"
              v-model="_formData[item.prop]"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
              v-bind="item.config"
            >
            </zk-date-picker>
            <!--单选框-->
            <zk-radio v-else-if="item.type === 'radio'" v-model="_formData[item.prop]" v-bind="item.config"></zk-radio>
            <!--多选框-->
            <zk-checkbox
              v-else-if="item.type === 'checkbox'"
              v-model="_formData[item.prop]"
              v-bind="item.config"
            ></zk-checkbox>
            <!--数字输入框-->
            <zk-input-number
              v-else-if="item.type === 'numberInput'"
              v-model="_formData[item.prop]"
              v-bind="item.config"
            ></zk-input-number>
            <!--json编辑器-->
            <zk-json-editor
              v-else-if="item.type === 'jsonEditor'"
              v-model="_formData[item.prop]"
              lang="json5"
              v-bind="item.config"
            ></zk-json-editor>
            <!-- 输入框 -->
            <zk-input v-else-if="item.type === 'input'" v-model="_formData[item.prop]" v-bind="item.config"></zk-input>
            <template v-if="item.slot === 'default'" #default>
              <slot name="default"></slot>
            </template>
            <template v-if="item.slot === 'label' || active" #label>
              <slot name="label"></slot>
              <div v-if="active" class="append-label">
                <el-icon v-if="item.append" class="close" color="red" @click="removeFormItem(item.prop)">
                  <CircleClose />
                </el-icon>
                {{ item.label }}
              </div>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
      <zk-button v-if="active" type="primary" @click="addFormItem">添加一项</zk-button>
    </el-form>
    <zk-dialog :model-value="dialogShow" width="400px" @cancel="closeDialog" @close="closeDialog" @confirm="confirmAdd">
      <template #header>
        <span style="font-size: 18px">添加表单项</span>
      </template>
      <zk-form
        v-model:form-config="addFormConfig"
        v-model:form-data="addFormData"
        :rules="addFormRules"
        ref="addFormItemFormRef"
      ></zk-form>
    </zk-dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * @description 用法
 * @example config和官方的配置一致
 * 需要动态添加或者删除表单项时，设置active为true
 * const formConfig = [
 *   // 使用下拉框
 *   {
 *     label: '性别',
 *     prop: 'gender',
 *     type: 'select',
 *     config: {
 *       options: [
 *         {
 *           label: '男',
 *           value: '1',
 *         },
 *         {
 *           label: '女',
 *           value: '2',
 *         },
 *       ],
 *     },
 *   },
 *   // 使用时间选择器
 *   {
 *     label: '选择时间',
 *     prop: 'data',
 *     type: 'datePicker',
 *   },
 *   // 使用单选框
 *   {
 *     label: '性别',
 *     prop: 'radio',
 *     type: 'radio',
 *     config: {
 *       options: [
 *         {
 *           label: '男',
 *           value: '1',
 *         },
 *         {
 *           label: '女',
 *           value: '2',
 *         },
 *       ],
 *     },
 *   },
 *   // 使用多选框
 *   {
 *     label: '多选框',
 *     prop: 'checkbox',
 *     type: 'checkbox',
 *     config: {
 *       options: [
 *         {
 *           label: '唱',
 *           value: '0',
 *         },
 *         {
 *           label: '跳',
 *           value: '1',
 *         },
 *         {
 *           label: 'rap',
 *           value: '2',
 *         },
 *       ],
 *     },
 *   },
 *   // 使用输入框
 *   {
 *     // 不输入 type 默认为输入框
 *     label: '输入框',
 *     prop: 'input',
 *     inputType: 'text',
 *     config: {
 *       placeholder: '请输入',
 *     },
 *   },
 * ]
 */
import { ref, reactive, computed, watch } from 'vue'
import { FormInstance, FormRules } from 'element-plus'
import { CircleClose } from '@element-plus/icons-vue'
import type ZkForm from '@/components/zk-form.vue'

interface ZkFormProps {
  formConfig: any[] | Record<string, any>
  formData: Record<string, any>
  labelWidth?: number | string
  rules?: FormRules
  itemWidth?: string
  inline?: boolean
  gutter?: number
  active?: boolean // 是否为可添加/删除表单项的表单
}

const props = withDefaults(defineProps<ZkFormProps>(), {
  formConfig: () => [],
  formData: () => ({}),
  labelWidth: '60',
  rules: () => ({}),
  itemWidth: '',
  inline: false,
  gutter: 20,
})

const emit = defineEmits(['update:form-data', 'update:form-config'])
const _formConfig = reactive(props.formConfig)
const _formData = reactive(props.formData)
const ElFormRef = ref<FormInstance>()
const addFormItemFormRef = ref<InstanceType<typeof ZkForm>>()
const dialogShow = ref(false)
const addFormConfig = [
  {
    prop: 'label',
    label: '标签',
    type: 'input',
    config: {
      placeholder: '输入标签',
    },
  },
  {
    prop: 'value',
    label: '字段',
    type: 'input',
    config: {
      placeholder: '输入字段',
    },
  },
]
const addFormData = reactive({
  label: '',
  value: '',
})
const addFormRules: FormRules = reactive({
  label: [{ required: true, message: '请输入标签', trigger: 'blur' }],
  value: [
    {
      required: true,
      message: '请输入字段',
      trigger: 'blur',
    },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '请输入字母、数字或下划线', trigger: 'blur' },
  ],
})
const _inline = computed(() => {
  if (props.inline) {
    return {
      lg: 8,
      md: 12,
    }
  } else {
    return {
      xs: 24,
      sm: 24,
    }
  }
})
const _labelWidth = computed(() => {
  return `${props.labelWidth}px`
})

watch(
  () => _formData,
  (newValue) => {
    emit('update:form-data', newValue)
  },
  { deep: true },
)

watch(
  _formConfig,
  (newValue) => {
    emit('update:form-config', newValue)
  },
  { deep: true },
)

// 打开添加表单项弹窗
const addFormItem = () => {
  dialogShow.value = true
}
// 确定添加
const confirmAdd = async () => {
  try {
    await addFormItemFormRef.value?.ElFormRef?.validate((valid, fields) => {
      if (valid) {
        const index = props.formConfig.findIndex((item: Record<string, any>) => item.prop === addFormData.value)
        if (index > -1) {
          ElMessage.error('字段已存在，请更换')
        } else {
          _formConfig.push({
            prop: addFormData.value,
            label: addFormData.label,
            type: 'input',
            append: true,
          })
          _formData[addFormData.value] = ''
          closeDialog()
        }
      } else {
        console.error('表单错误', fields)
      }
    })
  } catch (e) {
    console.log(e)
  }
}
// 移出添加过的表单项
const removeFormItem = (prop: string) => {
  const index = _formConfig.findIndex((item: Record<string, any>) => item.prop === prop)
  if (index > -1) {
    _formConfig.splice(index, 1)
    delete _formData[prop]
  }
}
const closeDialog = () => {
  addFormItemFormRef.value?.ElFormRef?.resetFields()
  dialogShow.value = false
}

defineExpose({ ElFormRef })
</script>

<style scoped lang="scss">
.append-label {
  display: flex;
  align-items: center;

  .close {
    cursor: pointer;
    margin-right: 4px;
  }
}

::v-deep(.el-form) {
  .el-form-item {
    width: 100%;
  }

  .el-form-item__content {
    display: block;
    flex-shrink: 0;
    width: 200px;
  }
}
</style>
