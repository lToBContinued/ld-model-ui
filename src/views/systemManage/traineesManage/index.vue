<template>
  <div class="trainees-manage">
    <zk-card header="参训单位员列表">
      <div class="feature-area">
        <zk-button type="primary" :icon="Plus" @click="companyDialogShow = true">添加</zk-button>
        <zk-button type="success" :icon="Upload" @click="addMoreCompanyDialogShow = true">批量导入</zk-button>
      </div>
      <zk-table
        v-model:current-page="tableState.currentPage"
        v-model:page-size="tableState.pageSize"
        :columns="traineesColumns"
        :data="tableState.totalData"
        :total="tableState.total"
        @update:current-page="currentPageChange"
        @update:page-size="pageSizeChange"
      >
        <template #operation="{ row }">
          <zk-button size="small" type="primary">编辑</zk-button>
          <el-popconfirm title="确认删除吗？" @confirm="deleteCompany(row.id)">
            <template #reference>
              <zk-button size="small" type="danger">删除</zk-button>
            </template>
          </el-popconfirm>
        </template>
      </zk-table>
    </zk-card>
    <zk-dialog
      v-model="companyDialogShow"
      :title="companyFormData.id ? '编辑参训单位' : '添加参训单位'"
      width="30%"
      @cancel="closeCompanyDialog"
      @close="closeCompanyDialog"
      @confirm="submitCompany"
    >
      <zk-form
        ref="addOneCompanyFormRef"
        v-model:form-data="companyFormData"
        :form-config="companyFormConfig"
        :rules="rules"
        label-width="80"
      ></zk-form>
    </zk-dialog>
    <zk-dialog
      v-model="addMoreCompanyDialogShow"
      :cancel-disabled="!currentFile"
      :confirm-disabled="!currentFile"
      cancel-text="取消上传"
      confirm-text="上传"
      title="上传文件"
      width="30%"
      @cancel="cancelUpload"
      @close="closeAddMoreCompanyDialog"
      @confirm="confirmUpload"
    >
      <zk-upload ref="UploadRef" v-model="currentFile"></zk-upload>
    </zk-dialog>
  </div>
</template>

<script setup lang="ts">
import { traineesColumns } from '@/views/systemManage/traineesManage/configs/tableConfigs.ts'
import { reactive, ref } from 'vue'
import { companyFormConfig } from '@/views/systemManage/traineesManage/configs/formConfigs.ts'
import { CompanyFormData, CompanyTableState, CompanyTableStateList } from '@/views/systemManage/types.ts'
import ZkForm from '@/components/zk-form.vue'
import { UploadFile } from 'element-plus'
import ZkUpload from '@/components/zk-upload.vue'
import { Plus, Upload } from '@element-plus/icons-vue'

/*-------------------------------------------------------------------------------------------------------------------**/
// 表格数据
const tableState = reactive<CompanyTableState>({
  totalData: [],
  total: 100,
  currentPage: 1,
  pageSize: 10,
})
// 新增/编辑单位弹窗
const companyDialogShow = ref(false)
const addOneCompanyFormRef = ref<InstanceType<typeof ZkForm>>()
const companyFormData = reactive<CompanyFormData>({
  companyName: '',
  companyCode: '',
  department: '',
  byword: '',
})
const rules: ValidFormRules<typeof companyFormData> = {
  companyName: [{ required: true, message: '此项不能为空', trigger: 'blur' }],
  companyCode: [{ required: true, message: '此项不能为空', trigger: 'blur' }],
}
// 上传文件弹窗
const addMoreCompanyDialogShow = ref(false)
const UploadRef = ref<InstanceType<typeof ZkUpload>>()
const currentFile = ref<UploadFile>()

/*-------------------------------------------------------------------------------------------------------------------**/
const getCompanyList = () => {}
const currentPageChange = (pageNum: number) => {}
const pageSizeChange = (pageSize: number) => {}
// 单次添加/修改单位信息
const submitCompany = async () => {
  try {
    await addOneCompanyFormRef.value?.ElFormRef?.validate()
    // TODO: 提交表单
  } catch (e) {
    console.error(e)
  }
}
const closeCompanyDialog = () => {
  addOneCompanyFormRef.value?.ElFormRef?.resetFields()
  companyDialogShow.value = false
}
const deleteCompany = (id: CompanyTableStateList['id']) => {
  console.log('>>>>> file: index.vue ~ method: deleteCompany <<<<<\n', id) // TODO: 删除
}
// 批量导入
const confirmUpload = () => {
  UploadRef.value?.ElUploadRef?.submit()
  // TODO: 上传文件，成功后删除文件，关闭弹窗
}
const cancelUpload = () => {
  if (currentFile.value) {
    UploadRef.value?.ElUploadRef?.abort(currentFile.value)
    UploadRef.value?.ElUploadRef?.clearFiles()
    currentFile.value = undefined
    ElMessage.success('上传已取消')
  }
}
const closeAddMoreCompanyDialog = () => {
  currentFile.value = undefined
  addMoreCompanyDialogShow.value = false
}
</script>

<style scoped lang="scss">
.feature-area {
  display: flex;
  justify-content: flex-end;
  margin-bottom: $spacing-size3;
}

::v-deep(.el-card) {
  height: calc(100vh - $tabbar-height - 2 * $spacing-size3);
}
</style>
