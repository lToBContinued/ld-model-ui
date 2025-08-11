<template>
  <div>
    <module-title title="用户管理"></module-title>
    <zk-card>
      <div class="search-form-wrapper">
        <div class="left">
          <div style="width: 300px">
            <zk-form v-model:form-config="searchUserFormConfig" v-model:form-data="searchUserFormData"></zk-form>
          </div>
          <div class="search-btns">
            <zk-button type="primary" @click="search">搜索</zk-button>
            <zk-button @click="reset">重置</zk-button>
          </div>
        </div>
        <div class="right">
          <zk-button type="primary" :icon="Plus" @click="openDialog">添加</zk-button>
          <zk-button type="primary" :icon="Upload">批量添加</zk-button>
        </div>
      </div>
      <zk-table
        :columns="userManageTableColumns"
        :data="state.totalData"
        max-height="600px"
        :total="state.total"
        v-model:current-page="state.currentPage"
        v-model:page-size="state.pageSize"
      >
        <template #delFlag="{ row }">
          <zk-tag :type="freezeStatus(row.delFlag).type">{{ freezeStatus(row.delFlag).text }} </zk-tag>
        </template>
        <template #operation="{ row }">
          <zk-button size="small" type="primary" @click="openDialog(row)">编辑</zk-button>
          <zk-button size="small" type="warning" @click="freeze(row.id)">
            {{ freezeStatus(row.delFlag).freezeBtnText }}
          </zk-button>
          <zk-button size="small" type="danger" @click="remove(row)">删除</zk-button>
        </template>
      </zk-table>
    </zk-card>
    <zk-dialog v-model="dialogShow" @close="closeDialog" @cancel="closeDialog" @confirm="confirmDialog">
      <template #header>
        <span style="font-size: 18px">{{ dialogHeader }}用户</span>
      </template>
      <div style="width: 300px">
        <zk-form
          ref="userFormRef"
          v-model:form-config="userFormConfig"
          v-model:form-data="userFormData"
          :rules="userFormRules"
        ></zk-form>
      </div>
    </zk-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, h, watchEffect } from 'vue'
import { userManageTableColumns } from '@/views/systemManage/userManage/configs/tableConfigs.ts'
import { getUserListApi } from '@/api/userManage'
import { UserInfo, UserListTable, SearchUserFormData, UserFormData } from '@/views/systemManage/types.ts'
import { userFormConfig, searchUserFormConfig } from '@/views/systemManage/userManage/configs/formConfigs.ts'
import ZkForm from '@/components/zk-form.vue'
import { Plus, Upload } from '@element-plus/icons-vue'
import { Action } from 'element-plus'

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
})
const userFormData = reactive<UserFormData>({
  id: '',
  username: '',
  password: '',
  phone: '',
})
const userFormRules = reactive<ValidFormRules<UserFormData>>({
  username: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

// 获取用户列表
const getUserList = async () => {
  const res = await getUserListApi()
  state.total = res.total!
  state.currentPage = res.currentPage!
  state.pageSize = res.pageSize!
  state.totalData = res.data!
}
// 格式化冻结状态
const freezeStatus = (delFlag: number) => {
  if (delFlag === 0) {
    return {
      type: 'success',
      text: '正常',
      freezeBtnText: '冻结',
    }
  } else {
    return {
      type: 'danger',
      text: '冻结',
      freezeBtnText: '解冻',
    }
  }
}
// 冻结用户
const freeze = (userId: UserInfo['id']) => {
  console.log('>>>>> file: index.vue ~ method: freeze <<<<<\n', userId) // TODO: 删除
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
    userFormData.phone = row?.phone
    userFormData.password = row?.password
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
  console.log('>>>>> file: index.vue ~ method: search <<<<<\n', searchUserFormData.username) // TODO: 删除
}
// 重置搜索框
const reset = () => {
  searchUserFormData.username = ''
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

watchEffect(() => {
  getUserList()
  console.log('>>>>> file: index.vue ~ method:  <<<<<\n', state.currentPage, state.pageSize) // TODO: 删除
})
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
    }
  }

  ::v-deep(.el-form-item) {
    margin-bottom: 0;
  }
}

::v-deep(.el-dialog__body) {
  display: flex;
  justify-content: center;
}
</style>
