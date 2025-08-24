<template>
  <div>
    <module-title title="用户管理"></module-title>
    <zk-card>
      <div class="search-form-wrapper">
        <div class="left">
          <div style="width: 100%">
            <zk-form
              v-model:form-config="searchUserFormConfig"
              v-model:form-data="searchUserFormData"
              label-width="0"
              inline
            ></zk-form>
          </div>
          <div class="search-btns">
            <zk-button type="primary" @click="search">搜索</zk-button>
            <zk-button @click="reset">重置</zk-button>
          </div>
        </div>
        <div class="right">
          <zk-button type="primary" :icon="Plus" @click="openDialog">添加</zk-button>
          <zk-button type="success" :icon="Upload" @click="addMoreUserDialogShow = true">批量导入 </zk-button>
        </div>
      </div>
      <zk-table
        v-model:current-page="state.currentPage"
        v-model:page-size="state.pageSize"
        :columns="userManageTableColumns"
        :data="state.totalData"
        :total="state.total"
        max-height="600px"
        @update:current-page="currentPageChange"
        @update:page-size="pageSizeChange"
      >
        <template #delFlag="{ row }">
          <zk-tag :type="freezeStatus(row.delFlag).type">
            {{ freezeStatus(row.delFlag).text }}
          </zk-tag>
        </template>
        <template #operation="{ row }">
          <zk-button size="small" type="primary" @click="openDialog(row)">编辑</zk-button>
          <zk-button size="small" type="danger" @click="remove(row)">删除</zk-button>
        </template>
      </zk-table>
    </zk-card>
    <zk-dialog
      class="add-user-dialog"
      v-model="dialogShow"
      :title="`${dialogHeader}用户`"
      width="400px"
      @cancel="closeDialog"
      @close="closeDialog"
      @confirm="confirmDialog"
    >
      <zk-form
        ref="userFormRef"
        v-model:form-config="userFormConfig"
        v-model:form-data="userFormData"
        :rules="userFormRules"
      ></zk-form>
    </zk-dialog>
    <zk-dialog
      v-model="addMoreUserDialogShow"
      :cancel-disabled="!currentFile"
      :confirm-disabled="!currentFile"
      cancel-text="取消上传"
      confirm-text="上传"
      title="上传文件"
      width="600px"
      @cancel="cancelUpload"
      @close="closeAddMoreUserDialog"
      @confirm="confirmUpload"
    >
      <zk-upload ref="UploadRef" v-model="currentFile"></zk-upload>
    </zk-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, h } from 'vue'
import { userManageTableColumns } from '@/views/systemManage/userManage/configs/tableConfigs.ts'
import { getUserListApi } from '@/api/userManage'
import { UserInfo, UserListTable, SearchUserFormData, UserFormData } from '@/views/systemManage/types.ts'
import { userFormConfig, searchUserFormConfig } from '@/views/systemManage/userManage/configs/formConfigs.ts'
import ZkForm from '@/components/zk-form.vue'
import { Plus, Upload } from '@element-plus/icons-vue'
import { Action, UploadFile } from 'element-plus'
import ZkUpload from '@/components/zk-upload.vue'

const dialogShow = ref()
const dialogHeader = ref('')
const userFormRef = ref<InstanceType<typeof ZkForm>>()
const state = reactive<UserListTable>({
  totalData: [],
  total: 0,
  currentPage: 1,
  pageSize: 10,
})
const searchUserFormData = reactive<SearchUserFormData>({
  username: '',
  role: undefined,
  status: undefined,
})
const userFormData = reactive<UserFormData>({
  id: '',
  username: '',
  password: '',
  role: undefined,
  department: '',
  status: undefined,
})
const userFormRules = reactive<ValidFormRules<UserFormData>>({
  username: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'blur' }],
  department: [{ required: true, message: '请输入部门', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
})
const UploadRef = ref<InstanceType<typeof ZkUpload>>()
const currentFile = ref<UploadFile>()
const addMoreUserDialogShow = ref(false)

// 获取用户列表
const getUserList = async () => {
  // TODO: 添加分页参数
  const res = await getUserListApi()
  state.total = res.total!
  state.totalData = res.data!
}
const currentPageChange = (currentPage: number) => {
  state.currentPage = currentPage
  getUserList()
}
const pageSizeChange = (pageSize: number) => {
  state.pageSize = pageSize
  getUserList()
}
// 格式化冻结状态
const freezeStatus = (delFlag: number) => {
  if (delFlag === 0) {
    return {
      type: 'success',
      text: '激活',
      freezeBtnText: '冻结',
    }
  } else if (delFlag === 1) {
    return {
      type: 'danger',
      text: '未激活',
      freezeBtnText: '解冻',
    }
  } else {
    return {
      type: 'danger',
      text: '锁定',
      freezeBtnText: '删除',
    }
  }
}
// 删除用户
const remove = (row: UserInfo) => {
  ElMessageBox({
    title: '警告',
    message: h('p', { class: 'user-unselect' }, [
      h('span', null, '确定要删除'),
      h('span', { style: { color: 'red' } }, row.username),
      h('span', null, '吗？'),
      h('span', { style: { color: 'red' } }, '删除后将无法恢复！'),
    ]),
    confirmButtonText: '确定',
    showCancelButton: true,
    callback: (action: Action) => {
      if (action === 'confirm') {
        console.log('>>>>> file: index.vue ~ method: callback <<<<<\n', row.id) // TODO: 删除
      }
    },
  })
}
// 打开编辑用户弹窗
const openDialog = (row?: UserInfo) => {
  dialogShow.value = true
  if (row && row.id) {
    dialogHeader.value = '编辑'
    userFormData.id = row?.id
    userFormData.username = row?.username
    userFormData.role = row?.role
    userFormData.department = row?.department
    userFormData.status = row?.status
  } else {
    dialogHeader.value = '添加'
  }
}
// 更新用户
const confirmDialog = async () => {
  await userFormRef.value?.ElFormRef?.validate()
  if (dialogHeader.value === '添加') {
    console.log('>>>>> file: index.vue ~ method: confirmDialog <<<<<\n', userFormData) // TODO: 删除
  } else if (dialogHeader.value === '编辑') {
    console.log('>>>>> file: index.vue ~ method: confirmDialog <<<<<\n', userFormData) // TODO: 删除
  }
}
// 搜索用户
const search = () => {
  console.log('>>>>> file: index.vue ~ method: search <<<<<\n', searchUserFormData) // TODO: 删除
}
// 重置搜索框
const reset = () => {
  Object.assign(searchUserFormData, {
    username: '',
    role: undefined,
    status: undefined,
  })
  getUserList()
}
// 关闭弹窗
const closeDialog = () => {
  userFormRef.value?.ElFormRef?.resetFields()
  Object.assign(userFormData, {
    id: '',
    username: '',
    password: '',
    phone: '',
  })
  dialogShow.value = false
}

// 批量导入
const confirmUpload = () => {
  UploadRef.value?.ElUploadRef?.submit()
  // TODO: 上传文件，成功后删除文件，关闭弹窗，重新获取用户列表
}
const cancelUpload = () => {
  if (currentFile.value) {
    UploadRef.value?.ElUploadRef?.abort(currentFile.value)
    UploadRef.value?.ElUploadRef?.clearFiles()
    currentFile.value = undefined
    ElMessage.success('上传已取消')
  }
}
const closeAddMoreUserDialog = () => {
  currentFile.value = undefined
  addMoreUserDialogShow.value = false
}

getUserList()
</script>

<style scoped lang="scss">
.search-form-wrapper {
  @include flex-center(row-between);

  margin-bottom: $spacing-size4;

  .left {
    display: flex;
    align-items: center;

    .search-btns {
      margin-left: $spacing-size4;
      width: 200px;
    }
  }

  ::v-deep(.el-form-item) {
    margin-bottom: 0;
  }
}
</style>
