<template>
  <div class="recent-records">
    <zk-card>
      <div class="title">最近评估记录</div>
      <zk-table :columns="recentRecordsColumns" :data="tableState.totalData" max-height="400">
        <template #level="{ row }">
          <zk-tag :type="formatLevel(row.level)?.type">{{ formatLevel(row.level)?.text }}</zk-tag>
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
import { ref, reactive } from 'vue'
import { getRecentRecordsApi } from '@/api/home'
import { recentRecordsColumns } from '@/views/home/configs/tableConfigs.ts'
import { RecentRecordTable } from '@/mock/types.ts'
import { formatLevel } from '@/utils/common/formatData.ts'

const dialogShow = ref(false)
const tableState = reactive<RecentRecordTable>({
  totalData: [],
})

const getRecentRecord = async () => {
  const res = await getRecentRecordsApi()
  tableState.totalData = res.data
}
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

// getRecentRecord()
</script>

<style scoped lang="scss">
.recent-records {
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
