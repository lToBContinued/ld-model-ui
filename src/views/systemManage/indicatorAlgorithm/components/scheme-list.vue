<template>
  <div class="scheme-component-wrapper">
    <ul class="scheme-list">
      <li v-highlight v-for="item in schemeList" :key="item.id">
        <div class="scheme-item bold" @click="selectScheme(item)">
          <span>{{ item.schemeName }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getSchemeListApi } from '@/api/schemeManage'
import { SchemeListItem } from '@/views/systemManage/types.ts'

const emit = defineEmits<{
  'scheme-change': [scheme: SchemeListItem]
}>()
const schemeList = ref<SchemeListItem[]>([])

// 获取方案列表
const getSchemeList = async () => {
  const res = await getSchemeListApi()
  schemeList.value = res.data as SchemeListItem[]
}
// 选择方案
const selectScheme = (scheme: SchemeListItem) => {
  emit('scheme-change', scheme)
}

getSchemeList()
</script>

<style scoped lang="scss">
.scheme-component-wrapper {
  overflow: hidden;
  height: calc(100vh - 50px - 2 * $spacing-size5);
  background-color: #fff;
  border: 1px solid $border-color1;

  .scheme-list {
    overflow-y: auto;
    height: calc(100% - 40px - $spacing-size3);
    margin-top: $spacing-size3;
  }

  .scheme-item {
    @include flex-center(row-between);

    width: 100%;
    height: 40px;
    padding: $spacing-size1;
    padding-left: $spacing-size3;

    font-size: $font-size-m;
    line-height: calc(40px - 2 * $spacing-size1);
    color: $main-text-color2;

    transition: all 0.3s;

    &:hover {
      background-color: #e3edff;
    }
  }

  .scheme-item-active {
    background-color: #fff;
  }
}
</style>
