<template>
  <div class="trainees-manage">
    <zk-card header="参训单位员列表">
      <div class="feature-area">
        <zk-button type="primary">导入参训单位</zk-button>
        <zk-button type="success" @click="addOneCompanyDialogVisible = true">添加参训单位员 </zk-button>
      </div>
      <zk-table
        v-model:current-page="tableState.currentPage"
        v-model:page-size="tableState.pageSize"
        :columns="traineesColumns"
        :data="tableState.totalData"
        :total="tableState.total"
        @update:current-page="currentPageChange"
        @update:page-size="pageSizeChange"
      ></zk-table>
    </zk-card>
    <zk-dialog
      v-model="addOneCompanyDialogVisible"
      title="添加参训单位员"
      @cancel="closeAddOneCompanyDialog"
      @close="closeAddOneCompanyDialog"
      @confirm="submitAddOneCompany"
      width="30%"
    >
      <zk-form
        ref="addOneCompanyFormRef"
        :form-config="addOneCompanyFormConfig"
        v-model:form-data="addOneCompanyFormData"
        label-width="80"
        :rules="rules"
      ></zk-form>
    </zk-dialog>
  </div>
</template>

<script setup lang="ts">
import { traineesColumns } from '@/views/systemManage/traineesManage/configs/tableConfigs.ts'
import { reactive, ref } from 'vue'
import { addOneCompanyFormConfig } from '@/views/systemManage/traineesManage/configs/formConfigs.ts'
import { AddOneCompanyFormData } from '@/views/systemManage/types.ts'
import ZkForm from '@/components/zk-form.vue'

const tableState = reactive({
  totalData: [],
  total: 100,
  currentPage: 1,
  pageSize: 10,
})
const addOneCompanyDialogVisible = ref(false)
const addOneCompanyFormRef = ref<InstanceType<typeof ZkForm>>()
const addOneCompanyFormData = reactive<AddOneCompanyFormData>({
  companyName: '',
  companyCode: '',
  department: '',
  byword: '',
})
const rules: ValidFormRules<typeof addOneCompanyFormData> = {
  companyName: [{ required: true, message: '此项不能为空', trigger: 'blur' }],
  companyCode: [{ required: true, message: '此项不能为空', trigger: 'blur' }],
}

const currentPageChange = (pageNum: number) => {}
const pageSizeChange = (pageSize: number) => {}
// 单次添加
const submitAddOneCompany = async () => {
  try {
    await addOneCompanyFormRef.value?.ElFormRef?.validate()
    // TODO: 提交表单
  } catch (e) {
    console.error(e)
  }
}
const closeAddOneCompanyDialog = () => {
  addOneCompanyFormRef.value?.ElFormRef?.resetFields()
  addOneCompanyDialogVisible.value = false
}
</script>

<style scoped lang="scss">
.feature-area {
  margin-bottom: $spacing-size3;
}

::v-deep(.el-card) {
  height: calc(100vh - $tabbar-height - 2 * $spacing-size3);
}
</style>
