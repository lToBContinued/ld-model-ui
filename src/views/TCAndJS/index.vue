<template>
  <div class="TCAndJS">
    <module-title></module-title>
    <zk-card>
      <zk-form v-model:form-config="formConfig" v-model:form-data="formData" :rules="rules" active inline></zk-form>
    </zk-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

const formConfig = reactive([
  {
    prop: 'name',
    label: '姓名',
    type: 'input',
  },
  {
    prop: 'age',
    label: '年龄',
    type: 'input',
  },
  {
    prop: 'hobby',
    label: '爱好',
    type: 'input',
  },
  {
    prop: 'address',
    label: '住址',
    type: 'input',
  },
  {
    prop: 'gender',
    label: '性别',
    type: 'input',
  },
])
const formData = reactive({
  name: '',
  age: '',
  hobby: '',
  address: '',
  gender: '',
})
const rules = reactive({
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
  hobby: [{ required: true, message: '请输入爱好', trigger: 'blur' }],
  address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
  gender: [{ required: true, message: '请输入性别', trigger: 'blur' }],
})

watch(
  formData,
  (newVal) => {
    console.log('>>>>> file: index.vue ~ method:  <<<<<\n', newVal) // TODO: 删除
  },
  { deep: true },
)
</script>

<style scoped lang="scss"></style>
