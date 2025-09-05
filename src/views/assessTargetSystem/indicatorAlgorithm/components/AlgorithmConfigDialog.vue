<template>
  <el-dialog v-model="visible" title="指标算法配置" width="980px" append-to-body destroy-on-close>
    <!-- 基本信息 -->
    <el-form label-width="90px" class="mb-3">
      <el-form-item label="指标名称">
        <el-input :model-value="node?.name || ''" disabled />
      </el-form-item>
      <el-form-item label="指标描述">
        <el-input :model-value="node?.description || ''" type="textarea" :rows="2" disabled />
      </el-form-item>
      <el-row :gutter="12">
        <el-col :span="8">
          <el-form-item label="启用">
            <el-switch v-model="enabled" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="!isRoot">
          <el-form-item label="权重">
            <el-input-number v-model="weight" :min="0" :step="1" controls-position="right" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 公式预览 + 公式编辑按钮 -->
      <el-form-item label="公式">
        <div class="formula-row">
          <div class="formula-preview" :title="formula || '未设置'">{{ formula || '未设置' }}</div>
          <FormulaButton
            v-if="subtreeId"
            :subtree-id="Number(subtreeId)"
            :value="formula || ''"
            @confirm="(f) => (formula = f)"
          />
        </div>
      </el-form-item>
    </el-form>
    <!--<div class="param-header">参数配置</div>
    &lt;!&ndash; 参数配置面板：用你“参考代码”的 SubtreeParamEditor &ndash;&gt;
    <SubtreeParamEditor v-if="node?.id" :node-id="Number(node!.id)" @changed="emitChanged" @error="onParamError" />-->
    <template #footer>
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" :loading="saving" @click="onSave">保 存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import FormulaButton from '@/components/FormulaButton.vue'
import SubtreeParamEditor from '@/components/SubtreeParamEditor.vue'
import type { SchemeIndicatorConfigItem } from '@/views/systemManage/types.ts'

interface Props {
  modelValue: boolean
  subtreeId?: number
  node?: NullType<SchemeIndicatorConfigItem>
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  subtreeId: undefined,
})

const emit = defineEmits<{
  'update:model-value': [value: boolean]
  save: [
    payload: {
      indicatorId: number
      enabled: 0 | 1
      weight: number | null
      formula: string | null
    },
  ]
  changed: []
}>()
const visible = computed({
  get: () => {
    return props.modelValue
  },
  set: (v) => {
    emit('update:model-value', v)
  },
})
const enabled = ref<0 | 1>(1)
const weight = ref<number | null>(null)
const formula = ref<string>('')
const isRoot = computed(() => (props.node?.level ?? 0) === 0)

watch(
  () => props.node,
  (newVal) => {
    enabled.value = (newVal?.enabled ?? 1) as 0 | 1
    weight.value = isRoot.value ? null : (newVal?.weight ?? null)
    formula.value = newVal?.formula || ''
  },
  { immediate: true },
)

const saving = ref(false)

function onParamError(msg: string) {
  console.warn(msg)
}

function emitChanged() {
  emit('changed')
}

async function onSave() {
  if (!props.node) return
  try {
    saving.value = true
    emit('save', {
      indicatorId: Number(props.node.id),
      enabled: enabled.value,
      weight: isRoot.value ? null : (weight.value ?? null),
      formula: (formula.value || '').trim() || null,
    })
    visible.value = false
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.mb-3 {
  margin-bottom: 12px;
}

.param-header {
  margin: 10px 0 6px;
  font-weight: 600;
}

.formula-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.formula-preview {
  overflow: hidden;
  flex: 1;

  min-height: 34px;
  padding: 6px 8px;

  color: #333;
  text-overflow: ellipsis;
  white-space: nowrap;

  background: #fafafa;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
}
</style>
