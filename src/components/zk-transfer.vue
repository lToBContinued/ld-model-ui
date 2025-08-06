<template>
  <el-transfer
    ref="ElTransferRef"
    v-model="value"
    :data="data"
    :filterable="filterable"
    :titles="titles"
    :props="props"
    :buttonTest="buttonTest"
    :format="format"
    :left-default-checked="leftDefaultChecked"
    :right-default-checked="rightDefaultChecked"
    v-bind="$attrs"
  >
    <template v-for="(val, name) in $slots" :key="name" #[name]="scopedData">
      <slot :name="name" v-bind="scopedData || {}"></slot>
    </template>
  </el-transfer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { TransferDataItem, TransferFormat, TransferPropsAlias, TransferInstance } from 'element-plus'

interface ZkTransferProps {
  modelValue: Array<string | number>
  data: TransferDataItem
  filterable?: boolean
  titles?: [string, string]
  props?: TransferPropsAlias
  buttonTest?: [string, string]
  format?: TransferFormat
  leftDefaultChecked?: Array<string | number>
  rightDefaultChecked?: Array<string | number>
  height?: string
}

const props = withDefaults(defineProps<ZkTransferProps>(), {
  height: '300px',
})

const emit = defineEmits(['update:modelValue'])
const ElTransferRef = ref<TransferInstance>()
const value = ref(props.modelValue)

watch(
  () => value.value,
  (val) => {
    value.value = val
    emit('update:modelValue', val)
  },
  {
    deep: true,
  },
)

defineExpose({ ElTransferRef })
</script>

<style scoped lang="scss">
::v-deep(.el-transfer-panel) {
  height: v-bind(height);

  .el-transfer-panel__body {
    height: 100%;
  }

  .el-transfer-panel__list {
    height: calc(100% - 40px);
  }
}
</style>
