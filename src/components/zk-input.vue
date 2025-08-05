<template>
  <div class="zk-input">
    <el-input ref="ElInputRef" v-bind="props" v-model="inputValue" :style="{ width: width }">
      <template v-if="prefixIcon" #prefix>
        <zk-icon :icon="prefixIcon" :element-icon="elementIcon" :color="iconColor" :size="iconSize"></zk-icon>
      </template>
      <template v-if="suffixIcon" #suffix>
        <zk-icon :icon="suffixIcon" :element-icon="elementIcon" :color="iconColor" :size="iconSize"></zk-icon>
      </template>
      <template v-if="$slots.prepend" #prepend>
        <slot name="prepend"></slot>
      </template>
      <template v-if="$slots.append" #append>
        <slot name="append"></slot>
      </template>
    </el-input>
  </div>
</template>

<script setup lang="ts">
/**
 * @description
 * 输入框的的前置图标和后置图标是由elementIcon控制的
 * 默认使用element-icon，需要传入el-icon图标对象，如果设置了elementIcon = false，则传入自定义的svg图标的文件名即可
 */
import { InputProps, InputInstance } from 'element-plus'
import { computed, ref } from 'vue'

interface ZkInputProps extends Partial<InputProps> {
  elementIcon?: boolean
  prefixIcon?: string | object
  suffixIcon?: string | object
  iconColor?: string
  iconSize?: string
  width?: string
}

const props = withDefaults(defineProps<ZkInputProps>(), {
  elementIcon: true,
  width: '240px',
})

const emit = defineEmits(['update:modelValue'])
const ElInputRef = ref<InputInstance>()

const inputValue = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

defineExpose({ ElInputRef })
</script>

<style scoped lang="scss"></style>
