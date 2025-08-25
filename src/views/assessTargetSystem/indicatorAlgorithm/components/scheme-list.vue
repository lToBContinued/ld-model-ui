<template>
  <div class="scheme-component-wrapper">
    <el-empty v-if="listState.totalData.length === 0" description="暂无方案" />
    <ul class="scheme-list">
      <li v-highlight v-for="item in listState.totalData" :key="item.id">
        <div class="scheme-item bold" @click="selectScheme(item)">
          <span>{{ item.name }}</span>
        </div>
      </li>
    </ul>
    <div class="pagination-wrapper">
      <zk-pagination
        v-model:current-page="listState.page"
        :total="listState.total"
        layout="prev, pager, next,"
        :page-size="listState.size"
        @update:current-page="pageChange"
      ></zk-pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ListState, SchemeListItem } from '@/views/assessTargetSystem/types.ts'
import { getSchemeListApi } from '@/api/schemeManage/index.ts'

const emit = defineEmits<{
  'scheme-change': [scheme: SchemeListItem]
}>()

const listState = reactive<ListState>({
  total: 0,
  totalData: [],
  page: 1,
  size: 30,
})
const loading = ref<boolean>(false)
const activeId = ref<string>('')

const loadList = async () => {
  loading.value = true
  try {
    const params = {
      page: listState.page,
      size: listState.size,
    }
    const res = await getSchemeListApi(params)
    listState.total = res.data!.total
    listState.totalData = res.data!.records
    // 首次自动选中第一条
    if (listState.totalData.length > 0) {
      selectScheme(listState.totalData[0])
    } else {
      activeId.value = ''
    }
  } catch (e) {
    console.error(e)
    listState.totalData = []
    activeId.value = ''
  } finally {
    loading.value = false
  }
}
const pageChange = (page: ListState['page']) => {
  listState.page = page
  loadList()
}
const selectScheme = (scheme: SchemeListItem) => {
  if (!scheme) return
  const idStr = String(scheme.id)
  if (activeId.value === idStr) return
  activeId.value = idStr
  emit('scheme-change', scheme)
}

loadList()
</script>

<style scoped lang="scss">
.scheme-component-wrapper {
  position: relative;

  overflow: hidden;

  height: calc(100vh - 50px - 2 * $spacing-size3);

  background-color: $primary-color;
  border: 1px solid $border-color1;

  .pagination-wrapper {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);

    width: 100%;
    height: 35px;
  }
}

.scheme-list {
  overflow-y: auto;
  height: calc(100% - 40px - $spacing-size3);
  padding-bottom: 35px;

  .scheme-item {
    @include flex-center(row-between);

    width: 100%;
    height: 40px;
    padding: $spacing-size1;
    padding-left: $spacing-size3;

    font-size: $font-size-m;
    line-height: calc(40px - 2 * $spacing-size1);
    color: $main-text-color2;

    border-top: 1px solid $border-color1;
    border-bottom: 1px solid $border-color1;

    transition: all 0.3s;

    &:hover {
      background-color: $hover-color;
    }
  }
}

.el-pagination {
  margin-top: 0;
}
</style>
