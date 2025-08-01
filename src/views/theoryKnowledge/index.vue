<template>
  <div class="theoretical-research-results">
    <module-title title="人才评估系统"></module-title>
    <div class="page-title">理论研究成果评估</div>
    <zk-card>
      <template #header>
        <div class="card-header">
          <span>理论研究成果评估表</span>
        </div>
      </template>
      <!--搜索表单-->
      <div class="search-wrapper">
        <zk-form
          class="search-form"
          ref="ZkFormRef"
          :form-config="theoryKnowledgeFormConfig"
          :form-data="formData"
          :rules="rules"
          label-width="120"
          inline
        ></zk-form>
        <div class="btn-group">
          <zk-button @click="reset">重置</zk-button>
          <zk-button type="primary" @click="submitForm">确定</zk-button>
        </div>
      </div>
      <!--结果表格-->
      <div class="result-wrapper">
        <zk-table :columns="columns" :data="tableData" max-height="400">
          <template #level="{ row }">
            <el-tag>{{ row.level }}</el-tag>
          </template>
          <template #operation="{ row }">
            <zk-button type="primary" @click="checkRow(row)">查看</zk-button>
          </template>
        </zk-table>
      </div>
    </zk-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FormRules } from 'element-plus'
import { theoryKnowledgeFormConfig } from '@/views/theoryKnowledge/configs/formConfig.ts'
import type { theoryKnowledgeFormType } from '@/views/theoryKnowledge/type.ts'
import type ZkForm from '@/components/zk-form.vue'

const ZkFormRef = ref<InstanceType<typeof ZkForm>>()
const formData = ref<theoryKnowledgeFormType>({
  name: '',
  employeeNumber: '',
  department: '',
  position: '',
  basicKnowledge: 0,
  professionalKnowledge: 0,
  actualApplication: 0,
  remark: '',
})
const rules: FormRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  employeeNumber: [{ required: true, message: '请输入员工编号', trigger: 'blur' }],
}
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
const tableData = ref([])

const submitForm = async () => {
  try {
    await ZkFormRef.value?.formRef?.validate()
    console.log('>>>>> file: index.vue ~ method: submitForm <<<<<\n', formData.value) // TODO: 删除
  } catch (e) {
    console.log(e)
  }
}
const reset = () => {
  ZkFormRef.value?.formRef?.resetFields()
}
const checkRow = (row: any) => {
  console.log('>>>>> file: recent-records.vue ~ method: checkRow <<<<<\n', row) // TODO: 删除
}
</script>

<style scoped lang="scss">
.page-title {
  margin-bottom: $spacing-size5;
  font-size: $title-size-l;
  font-weight: 700;
}

.card-header {
  font-size: $font-size-l;
  font-weight: 700;
}

.search-wrapper {
  @include flex-center(col-center);

  padding-bottom: $spacing-size5;
  border-bottom: 1px solid $border-color1;

  .search-form {
    display: flex;
    justify-content: center;
  }
}

.result-wrapper {
  padding-top: $spacing-size5;
}

::v-deep(.el-input__inner) {
  text-align: left;
}

::v-deep(.el-form) {
  width: 80%;
}
</style>
