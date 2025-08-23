<template>
  <div class="scheme-manage">
    <el-row class="user-unselect">
      <el-col :span="6">
        <scheme-list @scheme-change="schemeChange"></scheme-list>
      </el-col>
      <el-col :span="18">
        <div class="scheme-content">
          <el-empty v-if="Object.keys(selectedScheme).length === 0" description="暂无数据" />
          <div v-else>
            <div class="header">
              <p class="title bold">{{ selectedScheme?.name }}</p>
              <p v-show="selectedScheme?.schemeDesc?.trim() !== ''" class="desc">
                {{ selectedScheme?.schemeDesc?.trim() }}
              </p>
            </div>
            <scheme-collapse
              v-model="schemeIndicatorConfig"
              :indicator-options="indicatorOptions"
              :scheme-id="selectedScheme?.id"
            ></scheme-collapse>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { SchemeIndicatorConfigItem, SchemeListItem, SelectedScheme } from '@/views/systemManage/types'
import { getSchemeDetailApi } from '@/api/schemeManage/legacySubtree.ts'
import SchemeCollapse from './components/scheme-collapse.vue'
import SchemeList from './components/scheme-list.vue'

const selectedScheme = ref<SelectedScheme>({} as SelectedScheme)
const schemeIndicatorConfig = ref<SchemeIndicatorConfigItem[]>([])
const indicatorOptions = ref<{ label: string; value: number }[]>([])

watch(
  () => schemeIndicatorConfig,
  (newVal) => {
    console.log('>>>>> file: index.vue ~ method: schemeChange <<<<<\n', newVal.value) // TODO: 删除
  },
  { deep: true },
)

// 方案
const schemeChange = async (scheme: SchemeListItem) => {
  if (scheme.id === selectedScheme.value?.id) return
  // 先显示列表里的标题/描述
  selectedScheme.value = scheme as SelectedScheme
  // 拉详情（树 → config）
  const detail = await getSchemeDetail(scheme.id)
  console.log('>>>>> file: index.vue ~ method: schemeChange <<<<<\n', detail) // TODO: 删除
  schemeIndicatorConfig.value = detail.children
}
const getSchemeDetail = async (id: number) => {
  const res = await getSchemeDetailApi(id)
  return res.data
}
</script>

<style scoped lang="scss">
.scheme-content {
  overflow-y: auto;

  width: 100%;
  height: calc(100vh - 50px - 2 * $spacing-size5);
  margin-left: $spacing-size2;
  padding: $spacing-size3;

  background-color: $sub-bg-color;
  border: 1px solid $border-color1;

  .header {
    margin-bottom: $spacing-size2;

    .title {
      width: fit-content;
      margin: 0 auto;
      margin-bottom: $spacing-size2;
      padding: $spacing-size2;
      padding-bottom: 0;

      font-size: $font-size-l;
      color: $main-text-color2;
      text-align: center;

      border-bottom: 2px solid $primary-color;
    }

    .desc {
      width: 100%;
      padding: $spacing-size2;

      font-size: $font-size-s;
      color: $main-text-color3;
      text-indent: 2em;

      background-color: $main-bg-color;
      border-radius: $border-radius-size-m;
    }
  }

  .btn-group {
    @include flex-center(row-between);

    .add-second-level {
      margin-right: auto;
    }
  }
}

::v-deep(.el-card__body) {
  height: calc(100vh - 50px - 2 * $spacing-size5);
}
</style>
