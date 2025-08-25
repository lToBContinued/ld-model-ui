<template>
  <div class="assess-list">
    <!-- 遍历指标列表 -->
    <template v-for="indicator in indicatorsList" :key="indicator.indicatorId">
      <div class="indicator-item-wrapper" :style="{ 'padding-left': `${(level - 1) * 16}px` }">
        <div class="indicator-main">
          <p class="indicator-name">{{ indicator.indicatorName }}</p>
          <div class="input-box">
            <span class="label">请填写</span>
            <!-- 根据配置渲染不同类型的输入框 -->
            <zk-input-number
              v-if="indicator.formConfig?.type === 'numberInput'"
              v-model="indicator.formConfig.value"
              :max="indicator.formConfig?.config?.max"
              :min="indicator.formConfig?.config?.min"
              :step="indicator.formConfig?.config?.step"
              step-strictly
              style="width: 160px"
              @change="handleValueChange(indicator, $event)"
            ></zk-input-number>
            <zk-radio
              v-else-if="indicator.formConfig?.type === 'radio'"
              v-model="indicator.formConfig.value as string | number"
              :options="indicator.formConfig?.config?.options"
              @change="handleValueChange(indicator, $event)"
            ></zk-radio>
            <zk-select
              v-else-if="indicator.formConfig?.type === 'select'"
              v-model="indicator.formConfig.value as string | number"
              :options="indicator.formConfig?.config?.options"
              style="width: 160px"
              @change="handleValueChange(indicator, $event)"
            ></zk-select>
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
import AssessList from './assess-list.vue'
import { isNumber, isString } from '@/utils/common/validate.ts'
import { IndicatorListItem } from '@/views/runAssess/types.ts'

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
  if (isString(value) || isNumber(value)) {
    // TODO:发送计算请求
    console.log(
      '>>>>> file: assess-list.vue ~ method: handleValueChange <<<<<\n',
      `指标id: ${indicator.indicatorId}, 值: ${value}`,
    )
  }
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
    font-size: $font-size-s;
  }
}
</style>
