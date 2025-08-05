<template>
  <div>
    <div class="tools" v-if="showTools">
      <zk-button type="success" :icon="Download" @click="importExcel">导入表格</zk-button>
      <zk-button type="primary" :icon="Upload" @click="exportExcel">导出表格</zk-button>
    </div>
    <el-table
      ref="ElTableRef"
      class="table"
      border
      :data="data"
      :row-key="rowKey"
      :max-height="maxHeight"
      v-bind="$attrs"
    >
      <template v-for="(col, index) in columns" :key="col.prop || `col-${index}`">
        <!-- 专门处理 index 类型列 -->
        <el-table-column v-if="col.type === 'index'" v-bind="col" />
        <!-- 专门处理 selection 类型列 -->
        <el-table-column v-if="col.type === 'selection'" reserve-selection v-bind="col" />
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
    <el-pagination
      :total="total"
      v-model:current-page="_currentPage"
      v-model:page-size="_pageSize"
      :page-sizes="[5, 10, 20, 50]"
      :pager-count="5"
      background
      layout="->, total, sizes, prev, pager, next, jumper"
      @current-change="pageChange"
      @size-change="handleSizeChange"
    ></el-pagination>
  </div>
</template>

<script setup lang="ts">
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
import { ref, computed } from 'vue'
import { TableInstance } from 'element-plus'
import { Download, Upload } from '@element-plus/icons-vue'
import * as XLSX from 'xlsx'
import transformTableData from '@/utils/common/transformTableData.ts'

interface KitTableProps {
  data: any[]
  columns: any[]
  currentPage: number
  pageSize: number
  maxHeight?: string
  rowKey?: string | ((row: any) => string)
  total?: number
  selectedRows?: any[]
  showTools?: boolean
}

const props = withDefaults(defineProps<KitTableProps>(), {
  maxHeight: '550px',
  currentPage: 1,
  pageSize: 10,
  showTools: false,
})

const emit = defineEmits(['update:current-page', 'update:page-size'])

const ElTableRef = ref<TableInstance>()
const _currentPage = computed({
  get() {
    return props.currentPage
  },
  set(val) {
    emit('update:current-page', val)
  },
})
const _pageSize = computed({
  get() {
    return props.pageSize
  },
  set(val) {
    emit('update:page-size', val)
  },
})

const pageChange = (currentPage: number) => {
  console.log('>>>>> file: kit-table.vue ~ method: pageChange <<<<<\n', currentPage) // TODO: 删除
}
const handleSizeChange = (pageSize: number) => {
  console.log('>>>>> file: kit-table.vue ~ method: handleSizeChange <<<<<\n', pageSize) // TODO: 删除
}

const importExcel = () => {}
const exportExcel = () => {
  const exportData = transformTableData(props.selectedRows as any[], props.columns)
  const worksheet = XLSX.utils.json_to_sheet(exportData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  XLSX.writeFile(workbook, 'export.xlsx', { compression: true })
}

defineExpose({ ElTableRef })
</script>

<style lang="scss" scoped>
.table {
  margin-bottom: 24px;
}

.tools {
  display: flex;
  justify-content: flex-end;
  padding: 12px 0;
}
</style>
