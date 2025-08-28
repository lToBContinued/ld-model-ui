<template>
  <el-form>
    <!--<div v-for="(item, index) in selectOptions" :key="item.id" class="select-option-item">
      <el-form-item class="form-item-inner" label="标签名" prop="label">
        <zk-input v-model="item.label" placeholder="请输入标签名"></zk-input>
      </el-form-item>
      <el-form-item class="form-item-inner" label="值" prop="value">
        <zk-input-number v-model="item.value" :controls="false" align="left" placeholder="请输入值"></zk-input-number>
      </el-form-item>
      <el-icon class="icon-btn" color="#67c23a" @click="addOption(index)">
        <Plus />
      </el-icon>
      <el-icon v-if="selectOptions.length > 2" class="icon-btn" color="#f56c6c" @click="removeOption(index)">
        <Close />
      </el-icon>
    </div>
    &lt;!&ndash; 无效项提示（可选，提升用户体验） &ndash;&gt;
    <div v-if="getInvalidOptionCount() > 0" class="invalid-tip">提示：未填写标签名或值的选项将不会被保存</div>-->
  </el-form>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { ref } from 'vue'

interface SelectConfig {
  type: 'select'
  value: NullType<number>
  config: {
    options: {
      label: string
      value: number
    }[]
  }
}

interface DefineProps {
  modelValue: SelectConfig
}

const props = withDefaults(defineProps<DefineProps>(), {})
const selectOptions = ref(props.modelValue.config.options)
</script>

<style scoped lang="scss"></style>
