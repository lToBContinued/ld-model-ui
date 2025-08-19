<template>
  <div class="scheme-component-wrapper">
    <zk-button @click="addSchemeGroup" :icon="Plus" style="margin: 4px 0 0 4px">添加方案</zk-button>
    <ul class="scheme-list">
      <li v-highlight v-for="item in schemeList" :key="item.id">
        <div class="scheme-item bold" @click="selectScheme(item)">
          <span>{{ item.schemeName }}</span>
          <zk-button type="danger" link @click.stop="removeSchema(item)">删除</zk-button>
        </div>
      </li>
    </ul>
    <zk-dialog
      v-model="addSchemeDialogShow"
      width="500px"
      @cancel="closeAddSchemeDialog"
      @close="closeAddSchemeDialog"
      @confirm="confirmAddScheme"
      @open="addSchemeDialogOpen"
    >
      <template #header>
        <span style="font-size: 18px">添加方案</span>
      </template>
      <zk-form
        ref="addSchemeFormRef"
        v-model:form-config="addSchemeFormConfig"
        v-model:form-data="addSchemeFormData"
        label-width="100"
      ></zk-form>
    </zk-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { AddSchemeFormData, AddSchemeFormItem, SchemeListItem } from '@/views/systemManage/types.ts'
import ZkForm from '@/components/zk-form.vue'
import { addSchemeApi, getSchemeListApi, removeSchemeApi } from '@/api/schemeManage'
import { getIndicatorSystemListApi } from '@/api/indicatorManage'
import { AddSchemeApiSend } from '@/api/schemeManage/types.ts'

const emit = defineEmits<{
  'scheme-change': [scheme: SchemeListItem]
  'remove-scheme': [scheme: SchemeListItem]
}>()
const addSchemeFormRef = ref<InstanceType<typeof ZkForm>>()
const addSchemeDialogShow = ref(false)
const schemeList = ref<SchemeListItem[]>([])
const addSchemeFormData = reactive<AddSchemeFormData>({
  indicatorSystem: undefined,
  schemeDesc: '',
  schemeName: '',
})
const addSchemeFormConfig = ref<AddSchemeFormItem[]>([
  {
    prop: 'schemeName',
    label: '方案名称',
    type: 'input',
    rules: [{ required: true, message: '请输入方案名称', trigger: 'blur' }],
  },
  {
    prop: 'indicatorSystem',
    label: '指标体系',
    type: 'select',
    rules: [{ required: true, message: '请选择指标体系', trigger: 'change' }],
    config: {
      options: [],
    },
  },
  {
    prop: 'schemeDesc',
    label: '方案描述',
    type: 'input',
    config: {
      type: 'textarea',
    },
  },
])

// 打开添加方案弹窗，获取指标体系列表
const addSchemeDialogOpen = async () => {
  const res = await getIndicatorSystemListApi()
  const options = res.data!.map((item) => {
    return {
      label: item.indicatorName,
      value: item.id,
    }
  })
  const formItem = addSchemeFormConfig.value.find((item) => item.prop === 'indicatorSystem')
  formItem!.config!.options = options
}
// 获取方案列表
const getSchemeList = async () => {
  const res = await getSchemeListApi()
  schemeList.value = res.data
}
// 方案相关
const addSchemeGroup = () => {
  addSchemeDialogShow.value = true
}
const closeAddSchemeDialog = () => {
  addSchemeFormRef.value?.ElFormRef?.resetFields()
  addSchemeDialogShow.value = false
}
const confirmAddScheme = async () => {
  try {
    await addSchemeFormRef.value?.ElFormRef?.validate()
    const newGroup = {
      ...addSchemeFormData,
    } as AddSchemeApiSend
    await addSchemeApi(newGroup)
    await getSchemeList()
    closeAddSchemeDialog()
  } catch (e) {
    console.error(e)
  }
}
const removeSchema = async (scheme: SchemeListItem) => {
  const res = await removeSchemeApi(scheme.id)
  if (res.status === 200) {
    ElMessage.success(res.msg)
    await getSchemeList()
  }
  emit('remove-scheme', scheme)
}
// 选择方案
const selectScheme = (scheme: SchemeListItem) => {
  emit('scheme-change', scheme)
}

getSchemeList()
</script>

<style scoped lang="scss">
.scheme-component-wrapper {
  overflow: hidden;
  height: calc(100vh - 50px - 2 * $spacing-size5);
  background-color: #fff;
  border: 1px solid $border-color1;

  .scheme-list {
    overflow-y: auto;
    height: calc(100% - 40px - $spacing-size3);
    margin-top: $spacing-size3;
  }

  .scheme-item {
    @include flex-center(row-between);

    width: 100%;
    height: 40px;
    padding: $spacing-size1;
    padding-left: $spacing-size3;

    font-size: $font-size-m;
    line-height: calc(40px - 2 * $spacing-size1);
    color: $main-text-color2;

    transition: all 0.3s;

    &:hover {
      background-color: #e3edff;
    }
  }

  .scheme-item-active {
    background-color: #fff;
  }
}
</style>
