<template>
  <div class="scheme-component-wrapper">
    <!-- 列表区 -->
    <div v-if="loading" class="loading">加载中…</div>
    <template v-else>
      <el-empty v-if="schemeList.length === 0" description="暂无方案" />
      <ul v-else class="scheme-list">
        <li
          v-for="item in schemeList"
          :key="item.id"
          :class="['scheme-item', String(item.id) === activeId ? 'scheme-item-active' : '']"
          @click="selectScheme(item)"
        >
          <div class="row">
            <span class="name bold">{{ item.name || '#' + item.id }}</span>
          </div>
          <div v-if="item.description" class="desc" :title="item.name">
            {{ item.description }}
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { SchemeListItem } from '@/views/systemManage/types'
import { getSchemeListApi } from '@/api/schemeManage/legacySubtree.ts' // ★ 直连你的“老后端”

const emit = defineEmits<{
  'scheme-change': [scheme: SchemeListItem]
}>()

const loading = ref<boolean>(false)
const schemeList = ref<SchemeListItem[]>([])
const activeId = ref<string>('')

async function loadList() {
  loading.value = true
  try {
    const list = await getSchemeListApi()
    schemeList.value = list.data.records
    console.log('>>>>> file: scheme-list.vue ~ method: loadList <<<<<\n', schemeList.value) // TODO: 删除
    // 首次自动选中第一条
    if (schemeList.value.length > 0) {
      selectScheme(schemeList.value[0])
    } else {
      activeId.value = ''
    }
  } catch (e) {
    console.error('[scheme-list] getSchemeListApi error:', e)
    schemeList.value = []
    activeId.value = ''
  } finally {
    loading.value = false
  }
}

function selectScheme(scheme: SchemeListItem) {
  if (!scheme) return
  const idStr = String(scheme.id)
  if (activeId.value === idStr) return
  activeId.value = idStr
  emit('scheme-change', scheme)
}

onMounted(loadList)
</script>

<style scoped lang="scss">
.scheme-component-wrapper {
  overflow: hidden;
  display: flex;
  flex-direction: column;

  height: calc(100vh - 50px - 2 * $spacing-size5);

  background-color: $primary-color;
  border: 1px solid $border-color1;
}

.loading {
  padding: 12px;
  color: #666;
  text-align: center;
}

.scheme-list {
  overflow-y: auto;
  height: calc(100% - 40px - $spacing-size3);
  margin-top: $spacing-size3;
  padding: 0 $spacing-size2;
}

.scheme-item {
  cursor: pointer;

  width: 100%;
  margin-bottom: 8px;
  padding: $spacing-size2 $spacing-size3;

  background: #fff;
  border-radius: 10px;

  transition: all 0.2s;

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .name {
    font-size: $font-size-m;
    color: $main-text-color2;
  }

  .desc {
    overflow: hidden;

    margin-top: 6px;

    font-size: $font-size-s;
    color: $main-text-color3;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover {
    background-color: #f7faff;
  }
}

.scheme-item-active {
  background: #f8fbff;
  border-color: #4c7dff;
  box-shadow: 0 0 0 2px rgb(76 125 255 / 12%);
}
</style>
