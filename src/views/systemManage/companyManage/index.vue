<template>
  <div class="company-manage">
    <module-title></module-title>
    <div class="page-title">评估单位管理</div>
    <zk-card>
      <zk-table
        :data="state.totalData"
        :columns="companyTableColumns"
        :total="state.total"
        v-model:current-page="state.currentPage"
        v-model:page-size="state.pageSize"
      >
        <template #operation="{ row }">
          <div class="operation-btns">
            <zk-button type="primary" @click="editCompany(row)">编辑</zk-button>
            <el-popconfirm title="确定要删除吗？" @confirm="removeCompany(row)">
              <template #reference>
                <zk-button type="danger">删除</zk-button>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </zk-table>
    </zk-card>
    <zk-dialog
      ref="addCompanyFormRef"
      :model-value="dialogShow"
      @cancel="closeDialog"
      @close="closeDialog"
      @confirm="confirmAddCompany"
      title="新增单位"
    >
      <zk-form
        :form-config="addCompanyFormConfig"
        :form-data="addCompanyFormData"
        :rules="rules"
        label-width="80"
      ></zk-form>
    </zk-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { companyTableColumns } from '@/views/systemManage/companyManage/configs/tableConfigs.ts'
import { getAssessCompanyListApi } from '@/api/companyManage'
import ZkTable from '@/components/zk-table.vue'
import { addCompanyFormDataType } from '@/views/systemManage/types.ts'
import { addCompanyFormConfig } from '@/views/systemManage/companyManage/configs/formConfigs.ts'
import ZkForm from '@/components/zk-form.vue'
import { FormRules } from 'element-plus'

const addCompanyFormRef = ref<InstanceType<typeof ZkForm>>()
const dialogShow = ref(false)
const state = reactive({
  totalData: [],
  currentPage: 1,
  pageSize: 10,
  total: 0,
})
const addCompanyFormData = ref<addCompanyFormDataType>({
  company: '',
  companyNumber: '',
  department: '',
  code: '',
})
const rules: FormRules<addCompanyFormDataType> = {
  company: [{ required: true, message: '请输入评估单位名称', trigger: 'blur' }],
  companyNumber: [{ required: true, message: '请输入评估单位编号', trigger: 'blur' }],
}

const getCompanyList = async () => {
  const res = await getAssessCompanyListApi()
  state.totalData = res.data
  state.total = res.total
}

const closeDialog = () => {
  dialogShow.value = false
  addCompanyFormRef.value?.formRef?.resetFields()
}
const confirmAddCompany = async () => {
  console.log('>>>>> file: index.vue ~ method: confirmAddCompany <<<<<\n', addCompanyFormData.value) // TODO: 删除
}
const editCompany = (row: any) => {
  dialogShow.value = true
  console.log('>>>>> file: index.vue ~ method: editCompany <<<<<\n', row) // TODO: 删除
}
const removeCompany = (row: any) => {
  console.log('>>>>> file: index.vue ~ method: removeCompany <<<<<\n', row) // TODO: 删除
}

getCompanyList()
</script>

<style scoped lang="scss">
.page-title {
  margin-bottom: $spacing-size5;
  font-size: $title-size-l;
  font-weight: 700;
}

::v-deep(.el-dialog__body) {
  @include flex-center(col-center);
}
</style>
