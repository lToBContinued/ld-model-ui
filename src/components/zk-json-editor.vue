<template>
  <v-ace-editor
    class="edit_box"
    v-model:value="editValue"
    v-bind="$attrs"
    :lang="lang"
    theme="tomorrow"
    :readonly="readonly"
    ref="aces"
    :class="{ border: hasBorder }"
    :options="options"
  />
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { VAceEditor } from 'vue3-ace-editor'
// 引入mode 和 theme 这里可以选择自己想要的主题和mode
import ace from 'ace-builds'
import modeJsonUrl from 'ace-builds/src-noconflict/mode-json5?url'
import modeProtobuf from 'ace-builds/src-noconflict/mode-protobuf?url'
import themeTomorrow from 'ace-builds/src-noconflict/theme-tomorrow?url'

ace.config.setModuleUrl('ace/mode/json5', modeJsonUrl)
ace.config.setModuleUrl('ace/mode/protobuf', modeProtobuf)
ace.config.setModuleUrl('ace/theme/tomorrow', themeTomorrow)

interface ZkJsonEditorProps {
  modelValue: string
  lang: 'json5' | 'protobuf' // 语言类型
  readonly?: boolean // 是否只读
  showLineNumbers?: boolean // 是否显示行数
  showGutter?: boolean // 是否显示左侧行数那列
  hasBorder?: boolean // 是否有外边框
  highlightActiveLine?: boolean // 是否高亮选中行
  options?: Record<string, any>
  width?: string
  height?: string
}

const props = withDefaults(defineProps<ZkJsonEditorProps>(), {
  lang: 'json5',
  readonly: false,
  hasBorder: true,
  highlightActiveLine: true,
  options: () => {
    return {
      fontSize: 16,
      tabSize: 2,
      showPrintMargin: false,
      highlightActiveLine: true,
      showLineNumbers: true,
      showGutter: true,
    }
  },
  width: '100%',
  height: '200px',
})

const emit = defineEmits(['update:model-value'])

const editValue = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    if (val !== props.modelValue) {
      emit('update:model-value', val)
    }
  },
})
</script>
<style scoped lang="scss">
.edit_box {
  width: v-bind('width');
  height: v-bind('height');
}

.border {
  border: 1px solid #c0c4cc;
}
</style>
