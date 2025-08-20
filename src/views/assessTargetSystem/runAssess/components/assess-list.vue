<template>
  <div class="assess-list">
    <!-- 遍历指标列表 -->
    <template v-for="(indicator, index) in indicatorsList" :key="index">
      <div class="indicator-item-wrapper" :style="{ 'padding-left': `${(level - 1) * 16}px` }">
        <div class="indicator-main">
          <p class="indicator-name">{{ indicator.indicatorName }}</p>
          <div class="input-box">
            <span class="label">分值</span>
            <!-- 根据配置渲染不同类型的输入框 -->
            <zk-input-number
              v-if="indicator.formConfig?.type === 'numberInput'"
              :max="indicator.formConfig?.config?.max"
              :min="indicator.formConfig?.config?.min"
              :model-value="indicator.formConfig.value"
              :step="indicator.formConfig?.config?.step"
              style="width: 160px"
              @change="handleValueChange(indicator, $event)"
            ></zk-input-number>
            <zk-button :loading="itemCalc" size="small" style="margin-left: 24px" @click="handelCalc(indicator)">
              计算
            </zk-button>
          </div>
        </div>
        <p class="indicator-desc">{{ indicator.indicatorDesc || '无描述' }}</p>
        <assess-list
          v-if="indicator.children && indicator.children.length > 0"
          :level="level + 1"
          :model-value="indicator.children"
        ></assess-list>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { IndicatorListItem } from '@/views/assessTargetSystem/types.ts'
import AssessList from './assess-list.vue' // 导入自身用于递归

interface DefineProps {
  modelValue: IndicatorListItem[]
  level?: number // 用于标识当前指标层级，默认为1
}

// 定义props，设置默认层级为1
const props = withDefaults(defineProps<DefineProps>(), {
  level: 1,
})

const emit = defineEmits<{
  'update:model-value': [value: IndicatorListItem[]]
}>()
const indicatorsList = ref<IndicatorListItem[]>(props.modelValue)
const itemCalc = ref(false)

watch(
  () => props.modelValue,
  (newVal) => {
    indicatorsList.value = newVal
  },
  {
    deep: true,
  },
)

const handleValueChange = (indicator: IndicatorListItem, value: number) => {
  indicator.formConfig.value = value
  emit('update:model-value', indicatorsList.value)
}
const handelCalc = (indicator: IndicatorListItem) => {
  console.log('>>>>> file: assess-list.vue ~ method: handelCalc <<<<<\n', indicator) // TODO: 删除
}
</script>

<style scoped lang="scss">
.assess-list {
  width: 100%;
}

.indicator-item-wrapper {
  transition: all 0.3s ease;

  .indicator-main {
    display: flex;
    align-items: center;

    width: 100%;
    padding: $spacing-size2;

    background-color: $main-bg-color;

    .indicator-name {
      flex: 1;
      margin-bottom: 0;
      font-size: $font-size-l;
    }
  }

  .input-box {
    display: flex;
    flex: 2;
    align-items: center;

    .label {
      margin-right: $spacing-size3;
      font-size: $font-size-m;
    }
  }

  .indicator-desc {
    margin-bottom: 0;
    padding: $spacing-size2;
    padding-left: $spacing-size2 + 20px; // 描述文字缩进
    font-size: $font-size-s;
  }
}
</style>
