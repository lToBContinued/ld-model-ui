<template>
  <div>
    <el-form ref="ElFormRef" v-bind="$attrs" :rules="rules" :model="_formData" :label-width="_labelWidth">
      <el-row :gutter="40" :justify="inline ? 'start' : 'center'">
        <el-col v-for="item in formConfig" :key="item.prop" v-bind="_inline">
          <el-form-item :label="item.label" :prop="item.prop">
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
            <!-- 输入框 -->
            <zk-input v-else v-model="_formData[item.prop]" v-bind="item.config"></zk-input>
            <template v-if="item.slot === 'default'" #default>
              <slot name="default"></slot>
            </template>
            <template v-else-if="item.slot === 'label'" #label>
              <slot name="label"></slot>
            </template>
            <template v-else-if="item.slot === 'error'" #error>
              <slot name="error"></slot>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
/**
 * @description 用法
 * @example config和官方的配置一致
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
import { FormInstance } from 'element-plus'

interface ZkFormProps {
  formConfig: any[] | Record<string, any>
  formData: Record<string, any>
  labelWidth?: number | string
  rules?: Record<string, any>
  itemWidth?: string
  inline?: boolean
}

const props = withDefaults(defineProps<ZkFormProps>(), {
  formConfig: () => [],
  formData: () => {
    return {}
  },
  labelWidth: '60',
  rules: () => {
    return {}
  },
  itemWidth: '',
  inline: false,
})

const emit = defineEmits(['form-change'])
const _formData = reactive(props.formData)
const ElFormRef = ref<FormInstance>()
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

watch(
  () => _formData,
  (newValue) => {
    emit('form-change', newValue)
  },
  { deep: true },
)

const _labelWidth = computed(() => {
  return `${props.labelWidth}px`
})

defineExpose({ ElFormRef })
</script>

<style scoped lang="scss">
::v-deep(.el-form) {
  .el-form-item {
    width: 100%;
  }

  .el-form-item__content {
    display: block;
    width: 200px;
    flex-shrink: 0;
  }
}
</style>
