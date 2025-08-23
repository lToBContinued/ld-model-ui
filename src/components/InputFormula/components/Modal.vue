<template>
  <Modal
    :open="props.open"
    centered
    :width="`${props.width}px`"
    :ok-text="props.okText"
    :cancel-text="props.cancelText"
    :zIndex="props.zIndex"
    :getContainer="props.getContainer"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <template #title>
      <h4>
        {{ props.title }}
        <TypographyText type="secondary" v-if="props.childTitle">
          {{ props.childTitle }}
        </TypographyText>
      </h4>
    </template>
    <slot></slot>
  </Modal>
</template>

<script lang="ts" setup>
import { Modal, Typography } from 'ant-design-vue'
const { Text: TypographyText } = Typography

const emit = defineEmits(['handleOk', 'handleCancel'])
const props = defineProps({
  open: { type: Boolean, default: false },
  width: { type: String, default: '1200' },
  title: { type: String, default: '' },
  childTitle: { type: String, default: '' },
  okText: { type: String, default: '确定' },
  cancelText: { type: String, default: '取消' },

  /* 新增：提高层级并确保挂到 body */
  zIndex: { type: Number, default: 3600 },
  // antd 的 getContainer 支持 HTMLElement | string | false | () => HTMLElement
  getContainer: { type: [Function, String, Boolean, Object] as any, default: () => document.body },
})
const handleOk = (e: MouseEvent) => emit('handleOk', e)
const handleCancel = (e: MouseEvent) => emit('handleCancel', e)
</script>
