<template>
  <el-form style="margin-top: 12px" :model="selectOptions">
    <div v-for="(item, index) in selectOptions.options" class="select-option-item">
      <el-form-item class="form-item-inner" label="标签名" prop="label">
        <zk-input v-model="item.label" placeholder="请输入标签名"></zk-input>
      </el-form-item>
      <el-form-item class="form-item-inner" label="值" prop="value">
        <zk-input-number v-model="item.value" :controls="false" align="left" placeholder="请输入值"></zk-input-number>
      </el-form-item>
      <el-icon class="icon-btn" color="#67c23a" @click="addOption(index)">
        <Plus />
      </el-icon>
      <el-icon v-if="selectOptions.options.length > 2" class="icon-btn" color="#f56c6c" @click="removeOption(index)">
        <Close />
      </el-icon>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { Close, Plus } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'

interface SelectConfig {
  options: {
    id?: string
    label: string
    value: NullType<number>
  }[]
}

interface DefineProps {
  modelValue: SelectConfig
}

const props = withDefaults(defineProps<DefineProps>(), {})
const selectOptions = ref<SelectConfig>(props.modelValue)

/**
 * @description 添加选项
 * @param {number} index 选项索引
 */
const addOption = (index: number) => {
  selectOptions.value.options.splice(index + 1, 0, {
    label: '',
    value: null,
  })
}
/**
 * @description 删除选项
 * @param {number} index 选项索引
 */
const removeOption = (index: number) => {
  if (selectOptions.value.options.length <= 2) {
    ElMessage.warning('至少保留2个选项')
    return
  }
  selectOptions.value.options.splice(index, 1)
}

watch(
  () => props.modelValue,
  (newVal) => {
    selectOptions.value = newVal
  },
  { deep: true, immediate: true },
)
</script>

<style scoped lang="scss">
.select-config-container {
  margin-top: $spacing-size3;
}

.select-option-item {
  display: flex;
  flex-wrap: wrap; // 防止选项过多换行溢出
  align-items: center;
  margin-bottom: $spacing-size2;
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
  font-size: 12px;
  line-height: 1.5;
  color: #909399;
}
</style>
