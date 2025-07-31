<template>
  <el-pagination
    v-bind="$attrs"
    v-model:current-page="_currentPage"
    v-model:page-size="_pageSize"
    :page-sizes="[5, 10, 20, 50]"
    background
    layout="->, total, sizes, prev, pager, next, jumper"
    :total="total"
  >
    <template v-if="Object.keys($slots).length">
      <slot></slot>
    </template>
  </el-pagination>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
  total: {
    type: Number,
    default: 0,
    required: true,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  size: {
    type: String,
    default: 'default',
  },
  background: {
    type: Boolean,
    default: true,
  },
  pageSizes: {
    type: Array,
    default: () => {
      return [5, 10, 15, 20]
    },
  },
})
const emit = defineEmits(['update:current-page', 'update:page-size'])

const ElPaginationRef = ref()

const _currentPage = computed({
  get() {
    return props.currentPage
  },
  set(newVal) {
    emit('update:current-page', newVal)
  },
})
const _pageSize = computed({
  get() {
    return props.pageSize
  },
  set(newVal) {
    emit('update:page-size', newVal)
  },
})

defineExpose({ ElPaginationRef })
</script>

<style scoped lang="scss">
.el-pagination {
  margin-top: $spacing-size4;
}
</style>
