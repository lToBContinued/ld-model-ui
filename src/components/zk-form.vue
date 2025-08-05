<template>
  <div>
    <el-form
      ref="ElFormRef"
      v-bind="$attrs"
      :rules="rules"
      :model="_formData"
      :label-width="_labelWidth"
      :inline="inline"
    >
      <el-form-item
        v-for="item in formConfig"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
        :style="{ width: itemWidth }"
      >
        <!-- 下拉框 -->
        <zk-select v-model="_formData[item.prop]" v-if="item.type === 'select'" v-bind="item.config"></zk-select>
        <!-- 时间选择器 -->
        <el-date-picker
          size="small"
          v-else-if="item.type === 'datePicker'"
          v-model="_formData[item.prop]"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
          v-bind="item.config"
        >
        </el-date-picker>
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
      </el-form-item>
      <el-form-item>
        <slot></slot>
      </el-form-item>
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

<style scoped lang="scss"></style>
