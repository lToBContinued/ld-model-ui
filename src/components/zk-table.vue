<template>
  <div>
    <el-table ref="ElTableRef" class="table" :data="data" border v-bind="$attrs" :max-height="maxHeight">
      <template v-for="(col, index) in columns" :key="col.prop || `col-${index}`">
        <!-- 专门处理 index 类型列 -->
        <el-table-column v-if="col.type === 'index'" v-bind="col" />
        <!-- 处理其他类型列 -->
        <el-table-column v-else v-bind="col">
          <!--表头插槽-->
          <template #header v-if="col.headerSlot">
            <slot :name="`header-${col.headerSlot}`"></slot>
          </template>
          <!-- 处理指定了slot的插槽 -->
          <template #default="scope" v-if="col.slot">
            <slot :name="col.slot" :row="scope.row" :_index="scope.$index"></slot>
          </template>
          <!-- 处理自定义渲染函数的插槽 -->
          <template #default="scope" v-else-if="col.render">
            {{ col.render(scope.row, scope.$index) }}
          </template>
          <!-- 处理默认值的插槽 -->
          <template #default="scope" v-else>
            {{ scope.row[col.prop] || col.defaultValue }}
          </template>
        </el-table-column>
      </template>
    </el-table>
    <zk-pagination
      :total="total"
      v-model:current-page="pageConfig.currentPage"
      v-model:page-size="pageConfig.pageSize"
      @change="pageChange"
    ></zk-pagination>
  </div>
</template>
<script setup>
/**
 * @description 通用表格组件
 * @example
 * 表格列 columns = [
 *   // 如需选择框，可以这样配置
 *   {
 *     type: 'selection',
 *     width: 55,
 *     align: 'center'
 *   },
 *   // 如需序号列，可以这样配置
 *   {
 *     type: 'index',
 *     label: '序号',
 *     width: 60,
 *     align: 'center'
 *   },
 *   {
 *     prop: 'date',
 *     label: '日期',
 *     width: 180,
 *     // 自定义渲染函数
 *     render: (row, index) => formatDate(row.date)
 *   },
 *   {
 *     prop: 'name',
 *     label: '姓名',
 *     width: 180,
 *     // 使用插槽
 *     slot: 'name'
 *   },
 *   {
 *     prop: 'address',
 *     label: '地址',
 *     defaultValue: '暂无地址'
 *   },
 * ]
 * // ... existing code ...
 */
import { ref } from 'vue'

const emit = defineEmits(['page-change'])
defineProps({
  data: {
    type: Array,
    default: () => [],
    required: true,
  },
  columns: {
    type: Array,
    default: () => [],
    required: true,
  },
  maxHeight: {
    type: String,
    default: '550px',
  },
  pageConfig: {
    type: Object,
    default: () => ({
      currentPage: 1,
      pageSize: 10,
    }),
  },
  total: {
    type: Number,
    default: 0,
  },
})

const ElTableRef = ref()

const pageChange = (currentPage, pageSize) => {
  emit('page-change', currentPage, pageSize)
}

defineExpose({ ElTableRef })
</script>

<style lang="scss" scoped>
.table {
  margin-bottom: $spacing-size5;
}
</style>
