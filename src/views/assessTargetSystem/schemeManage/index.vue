<template>
  <div class="scheme-manage">
    <el-row class="user-unselect">
      <el-col :span="6">
        <scheme-list @scheme-change="schemeChange" @remove-scheme="removeScheme"></scheme-list>
      </el-col>
      <el-col :span="18">
        <div class="scheme-content">
          <el-empty v-if="selectedScheme?.id === null" description="暂无数据" />
          <div v-else>
            <div class="header">
              <p class="title bold">{{ selectedScheme?.name }}</p>
              <p v-show="selectedScheme?.description?.trim() !== ''" class="desc">
                {{ selectedScheme?.description?.trim() }}
              </p>
            </div>
            <div class="btn-group">
              <zk-button class="add-second-level" :icon="Plus" @click="addSecondIndicatorDialogShow = true">
                添加二级指标
              </zk-button>
              <zk-button type="primary" @click="saveScheme">刷新</zk-button>
            </div>
            <scheme-collapse
              v-if="schemeCollapseShow"
              v-model="schemeIndicatorConfig"
              :indicator-options="indicatorOptions"
              :subtreeId="selectedScheme.subtreeId"
            ></scheme-collapse>
          </div>
        </div>
      </el-col>
    </el-row>
    <zk-dialog
      v-model="addSecondIndicatorDialogShow"
      width="500px"
      @cancel="closeAddChildIndicatorDialog"
      @close="closeAddChildIndicatorDialog"
      @confirm="confirmAddChildIndicator"
      @open="addSecondIndicatorDialogOpen"
    >
      <template #title>
        <span style="font-size: 18px">添加二级指标</span>
      </template>
      <zk-form
        ref="addSecondIndicatorRef"
        v-model="addSecondIndicatorFormData"
        :form-config="addSecondIndicatorFormConfig"
        label-width="100"
      ></zk-form>
    </zk-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  AddSecondIndicatorFormConfig,
  AddSecondIndicatorFormData,
  SchemeIndicatorConfigItem,
} from '@/views/assessTargetSystem/types.ts'
import { getSchemeDetailApi, updateSchemeApi } from '@/api/schemeManage'
import { Plus } from '@element-plus/icons-vue'
import SchemeCollapse from '@/views/assessTargetSystem/schemeManage/components/scheme-collapse.vue'
import SchemeList from '@/views/assessTargetSystem/schemeManage/components/scheme-list.vue'
import ZkForm from '@/components/zk/zk-form.vue'
import { getIndicatorAndDescendantsApi } from '@/api/indicatorManage'
import { SchemeListItem, UpdateSchemeApiSend } from '@/api/schemeManage/types.ts'

const selectedScheme = ref<SchemeIndicatorConfigItem>({
  id: undefined,
  children: [],
  parentId: undefined,
  hasChildren: undefined,
  hasSon: undefined,
  refIndicatorId: undefined,
  subtreeId: undefined,
  orderIndex: undefined,
  name: undefined,
  description: undefined,
  formula: undefined,
  enabled: undefined,
  weight: undefined,
})
const schemeIndicatorConfig = ref<SchemeIndicatorConfigItem[]>([])
// 二级指标
const addSecondIndicatorDialogShow = ref(false)
const addSecondIndicatorRef = ref<InstanceType<typeof ZkForm>>()
// 指标配置表单
const addSecondIndicatorFormData = ref<AddSecondIndicatorFormData>({
  indicatorId: undefined,
  description: '',
})
const addSecondIndicatorFormConfig = ref<AddSecondIndicatorFormConfig[]>([
  {
    prop: 'indicatorId',
    label: '指标名称',
    type: 'select',
    rules: [{ required: true, message: '请输入指标名称', trigger: 'blur' }],
    config: {
      options: [],
    },
  },
  {
    prop: 'description',
    label: '指标描述',
    type: 'input',
    config: {
      type: 'textarea',
    },
  },
])
// 添加二级指标的对话框的指标名称选项
const indicatorOptions = ref<{ label: string; value: number }[]>([])
const schemeCollapseShow = ref(true)

// 方案
const schemeChange = async (scheme: SchemeListItem) => {
  if (scheme.id === selectedScheme.value.id) return
  const res = await getSchemeDetailApi(scheme.id)
  selectedScheme.value = res.data as SchemeIndicatorConfigItem // 保存查询到的数据
  selectedScheme.value.subtreeId = scheme.id // 保存方案id
  schemeIndicatorConfig.value = selectedScheme.value.children as SchemeIndicatorConfigItem[] // 提取出指标配置
}

const saveScheme = async () => {
  if (selectedScheme.value.id) {
    const data = {
      refIndicatorId: addSecondIndicatorFormData.value.indicatorId,
      parentId: selectedScheme.value.id,
    } as UpdateSchemeApiSend
    const res = await updateSchemeApi(selectedScheme.value.subtreeId!, data)
    if (res.status === 200) {
      ElMessage.success('更新方案成功')
      const res = await getSchemeDetailApi(selectedScheme.value.subtreeId!)
      selectedScheme.value = res.data as SchemeIndicatorConfigItem
      schemeIndicatorConfig.value = selectedScheme.value.children || []
    }
  }
}
const removeScheme = () => {
  selectedScheme.value = {
    id: undefined,
    children: [],
    parentId: undefined,
    hasChildren: undefined,
    hasSon: undefined,
    refIndicatorId: undefined,
    subtreeId: undefined,
    orderIndex: undefined,
    name: undefined,
    description: undefined,
    formula: undefined,
    enabled: undefined,
    weight: undefined,
  }
}
// 二级指标
const addSecondIndicatorDialogOpen = async () => {
  // 直接传递数字参数
  const res = await getIndicatorAndDescendantsApi(Number(selectedScheme.value.refIndicatorId))
  const indicatorIdSelectConfig = addSecondIndicatorFormConfig.value.find((item) => item.prop === 'indicatorId')
  if (indicatorIdSelectConfig && indicatorIdSelectConfig.config) {
    indicatorIdSelectConfig.config.options =
      res.data?.map((item) => ({
        label: item.name,
        value: item.id,
      })) || []
  }
}
const confirmAddChildIndicator = async () => {
  try {
    await addSecondIndicatorRef.value?.ElFormRef?.validate()
    await saveScheme()
    closeAddChildIndicatorDialog()
  } catch (e) {
    console.error(e)
  }
}
const closeAddChildIndicatorDialog = () => {
  addSecondIndicatorRef.value?.ElFormRef?.resetFields()
  addSecondIndicatorDialogShow.value = false
}
</script>

<style scoped lang="scss">
.scheme-content {
  overflow-y: auto;

  width: 100%;
  height: calc(100vh - 50px - 2 * $spacing-size3);
  margin-left: $spacing-size2;
  padding: $spacing-size3;

  background-color: $primary-color;
  border: 1px solid $border-color1;

  .header {
    margin-bottom: $spacing-size2;

    .title {
      width: fit-content;
      margin: 0 auto;
      margin-bottom: $spacing-size2;
      padding: $spacing-size2;
      padding-bottom: 0;

      font-size: $font-size-l;
      color: $main-text-color2;
      text-align: center;

      border-bottom: 2px solid $primary-color;
    }

    .desc {
      width: 100%;
      padding: $spacing-size2;

      font-size: $font-size-s;
      color: $main-text-color2;
      text-indent: 2em;

      background-color: $main-bg-color;
      border-radius: $border-radius-size-m;
    }
  }

  .btn-group {
    @include flex-center(row-between);

    .add-second-level {
      margin-right: auto;
    }
  }
}
</style>
