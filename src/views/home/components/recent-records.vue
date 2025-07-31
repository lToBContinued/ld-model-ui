<template>
  <div class="recent-records">
    <zk-card>
      <div class="title">最近评估记录</div>
      <zk-table :columns="columns" :data="tableData" max-height="400">
        <template #level="{ row }">
          <el-tag>{{ row.level }}</el-tag>
        </template>
        <template #operation="{ row }">
          <zk-button type="primary" @click="checkRow(row)">查看</zk-button>
        </template>
      </zk-table>
    </zk-card>
    <zk-dialog
      :model-value="dialogShow"
      @cancel="closeDialog"
      @close="closeDialog"
      @confirm="dialogConfirm"
    ></zk-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const dialogShow = ref(false)
const columns = ref([
  {
    prop: 'name',
    label: '姓名',
    width: 180,
  },
  {
    prop: 'date',
    label: '评估时间',
    width: 180,
  },
  {
    prop: 'assessType',
    label: '地址',
    defaultValue: '暂无地址',
  },
  {
    prop: 'score',
    label: '得分',
    defaultValue: '0',
  },
  {
    prop: 'level',
    label: '评估等级',
    slot: 'level',
  },
  {
    label: '操作',
    slot: 'operation',
  },
])
const tableData = ref([
  {
    date: '2023-01-01',
    name: '张三',
    address: '北京市海淀区',
    assessType: '评估类型',
    score: 999,
    level: '合格',
  },
  {
    date: '2023-01-02',
    name: '李四',
    address: '北京市海淀区',
    assessType: '评估类型',
    score: 999,
    level: '合格',
  },
  {
    date: '2023-01-03',
    name: '王五',
    address: '北京市海淀区',
    assessType: '评估类型',
    score: 999,
    level: '合格',
  },
  {
    date: '2023-01-01',
    name: '张三',
    address: '北京市海淀区',
    assessType: '评估类型',
    score: 999,
    level: '合格',
  },
  {
    date: '2023-01-02',
    name: '李四',
    address: '北京市海淀区',
    assessType: '评估类型',
    score: 999,
    level: '合格',
  },
  {
    date: '2023-01-03',
    name: '王五',
    address: '北京市海淀区',
    assessType: '评估类型',
    score: 999,
    level: '合格',
  },
  {
    date: '2023-01-01',
    name: '张三',
    address: '北京市海淀区',
    assessType: '评估类型',
    score: 999,
    level: '合格',
  },
  {
    date: '2023-01-02',
    name: '李四',
    address: '北京市海淀区',
    assessType: '评估类型',
    score: 999,
    level: '合格',
  },
  {
    date: '2023-01-03',
    name: '王五',
    address: '北京市海淀区',
    assessType: '评估类型',
    score: 999,
    level: '合格',
  },
  {
    date: '2023-01-01',
    name: '张三',
    address: '北京市海淀区',
    assessType: '评估类型',
    score: 999,
    level: '合格',
  },
  {
    date: '2023-01-02',
    name: '李四',
    address: '北京市海淀区',
    assessType: '评估类型',
    score: 999,
    level: '合格',
  },
  {
    date: '2023-01-03',
    name: '王五',
    address: '北京市海淀区',
    assessType: '评估类型',
    score: 999,
    level: '合格',
  },
])

const checkRow = (row: any) => {
  dialogShow.value = true
  console.log('>>>>> file: recent-records.vue ~ method: checkRow <<<<<\n', row) // TODO: 删除
}
const closeDialog = () => {
  dialogShow.value = false
}
const dialogConfirm = () => {
  dialogShow.value = false
}
</script>

<style scoped lang="scss">
.recent-records {
  height: 600px;
  margin-bottom: $spacing-size5;

  .title {
    margin-bottom: $spacing-size5;
    padding-bottom: $spacing-size3;

    font-size: $font-size-l;
    font-weight: 700;

    border-bottom: 1px solid $border-color1;
  }
}
</style>
