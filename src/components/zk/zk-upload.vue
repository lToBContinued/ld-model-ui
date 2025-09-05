<template>
  <el-upload
    ref="ElUploadRef"
    :action="action"
    :auto-upload="autoUpload"
    :before-upload="beforeUpload"
    :drag="drag"
    :limit="limit"
    :on-change="onChange"
    :on-exceed="onExceed"
    :on-remove="onRemove"
    class="upload-demo"
    v-bind="$attrs"
  >
    <el-icon class="el-icon--upload">
      <upload-filled />
    </el-icon>
    <div class="el-upload__text">拖入文件或 <em>点击上传</em></div>
  </el-upload>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { UploadInstance, UploadRawFile, UploadFile, UploadFiles } from 'element-plus'
import { getFileExt } from '@/utils/common/file.ts'

interface DefineProps {
  modelValue?: UndefinedType<UploadFile>
  action?: string
  drag?: boolean
  autoUpload?: boolean
  limit?: number
  fileTypes?: string[]
}

const props = withDefaults(defineProps<DefineProps>(), {
  action: '/api/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15',
  drag: true,
  autoUpload: false,
  limit: 1,
  fileTypes: () => ['csv'],
})

const emit = defineEmits<{
  'update:model-value': [file: UndefinedType<UploadFile>]
  'before-upload': [rawFile: UploadRawFile]
  'on-change': [file: UploadFile]
}>()
const ElUploadRef = ref<UploadInstance>()
const currentFile = ref(props.modelValue)

watch(currentFile, (newVal) => {
  emit('update:model-value', newVal)
})

const beforeUpload = (rawFile: UploadRawFile) => {
  emit('before-upload', rawFile)
}
const onRemove = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  currentFile.value = undefined
}
const onChange = (file: UploadFile) => {
  // 校验文件扩展名是否正确
  const ext = getFileExt(file.name)
  if (props.fileTypes.includes(ext)) {
    currentFile.value = file
    emit('on-change', file)
  } else {
    ElUploadRef.value?.handleRemove(file)
    currentFile.value = undefined
    ElMessage.error(`文件类型必须为 .${props.fileTypes.join('、')}`)
  }
}
const onExceed = () => {
  currentFile.value = undefined
  ElMessage.error(`最多上传${props.limit}个文件`)
}

defineExpose({ ElUploadRef })
</script>

<style scoped lang="scss"></style>
