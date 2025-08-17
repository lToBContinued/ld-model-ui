<template>
  <div class="scheme-component-wrapper">
    <zk-button @click="addSchemeGroup" :icon="Plus" style="margin: 4px 0 0 4px">添加方案</zk-button>
    <ul class="scheme-list">
      <li v-highlight v-for="item in schemeList" :key="item.id">
        <div class="scheme-item bold" @click="selectScheme(item)">
          <span>{{ item.schemeName }}</span>
          <zk-button type="danger" link @click.stop="removeSchema(item.id)">删除</zk-button>
        </div>
      </li>
    </ul>
    <zk-dialog
      v-model="addSchemeDialogShow"
      width="500px"
      @cancel="closeAddSchemeDialog"
      @close="closeAddSchemeDialog"
      @confirm="confirmAddScheme"
    >
      <template #header>
        <span style="font-size: 18px">添加方案组</span>
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
import { AddSchemeFormData, SchemeListItem } from '@/views/systemManage/types.ts'
import { addSchemeFormConfig } from '@/views/systemManage/schemeManage/configs/formConfigs.ts'
import ZkForm from '@/components/zk-form.vue'
import { getSchemeListApi } from '@/api/schemeManage'

const emit = defineEmits<{
  'scheme-change': [scheme: SchemeListItem]
  'remove-scheme': [id: string]
}>()
const addSchemeFormRef = ref<InstanceType<typeof ZkForm>>()
const addSchemeDialogShow = ref(false)
const schemeList = ref<SchemeListItem[]>([])
const addSchemeFormData = reactive<AddSchemeFormData>({
  indicatorId: '',
  schemeDesc: '',
  schemeName: '',
})

// 获取方案列表
const getTreeConfig = async () => {
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
      id: '123456',
      ...addSchemeFormData,
    } as SchemeListItem
    schemeList.value.push(newGroup)
    closeAddSchemeDialog()
  } catch (e) {
    console.error(e)
  }
}
const removeSchema = (id: string) => {
  schemeList.value = schemeList.value.filter((item) => item.id !== id)
  emit('remove-scheme', id)
}
// 选择方案
const selectScheme = (scheme: SchemeListItem) => {
  emit('scheme-change', scheme)
}

getTreeConfig()
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
