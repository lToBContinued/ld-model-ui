<template>
  <div class="scheme-manage">
    <el-row class="user-unselect">
      <el-col :span="6">
        <scheme-list @scheme-change="schemeChange" @remove-scheme="removeScheme"></scheme-list>
      </el-col>
      <el-col :span="18">
        <div class="scheme-content">
          <el-empty v-if="Object.keys(selectedScheme).length === 0" description="暂无数据" />
          <div v-else>
            <div class="header">
              <p class="title bold">{{ selectedScheme?.schemeName }}</p>
              <p v-show="selectedScheme?.schemeDesc?.trim() !== ''" class="desc">
                {{ selectedScheme?.schemeDesc?.trim() }}
              </p>
            </div>
            <div class="btn-group">
              <zk-button class="add-second-level" :icon="Plus" @click="addSecondIndicatorDialogShow = true">
                添加二级指标
              </zk-button>
              <zk-button type="primary" @click="saveScheme">保存方案</zk-button>
            </div>
            <scheme-collapse v-model="schemeIndicatorConfig" :indicator-options="indicatorOptions"></scheme-collapse>
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
        v-model:form-config="addSecondIndicatorFormConfig"
        v-model:form-data="addSecondIndicatorFormData"
        label-width="100"
      ></zk-form>
    </zk-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import {
  AddSecondIndicatorFormConfig,
  AddSecondIndicatorFormData,
  SchemeIndicatorConfigItem,
  SchemeListItem,
  SelectedScheme,
} from '@/views/assessTargetSystem/types.ts'
import { getSchemeDetailApi, updateSchemeApi } from '@/api/schemeManage'
import { Plus } from '@element-plus/icons-vue'
import SchemeCollapse from '@/views/assessTargetSystem/schemeManage/components/scheme-collapse.vue'
import SchemeList from '@/views/assessTargetSystem/schemeManage/components/scheme-list.vue'
import ZkForm from '@/components/zk/zk-form.vue'
import { getIndicatorAndDescendantsApi } from '@/api/indicatorManage'

const selectedScheme = ref<SelectedScheme>({})
const schemeIndicatorConfig = ref<SchemeIndicatorConfigItem[]>([])
// 二级指标
const addSecondIndicatorDialogShow = ref(false)
const addSecondIndicatorRef = ref<InstanceType<typeof ZkForm>>()
// 指标配置表单
const addSecondIndicatorFormData = reactive<AddSecondIndicatorFormData>({
  indicatorId: undefined,
  indicatorDesc: '',
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
    prop: 'indicatorDesc',
    label: '指标描述',
    type: 'input',
    config: {
      type: 'textarea',
    },
  },
])
const indicatorOptions = ref<{ label: string; value: number }[]>([])

watch(
  () => schemeIndicatorConfig,
  (newVal) => {
    console.log('>>>>> file: index.vue ~ method: schemeChange <<<<<\n', newVal.value) // TODO: 删除
  },
  { deep: true },
)

// 方案
const schemeChange = async (scheme: SchemeListItem) => {
  if (scheme.id === selectedScheme.value.id) return
  selectedScheme.value = scheme
  selectedScheme.value = await getSchemeDetail(scheme.id)
  schemeIndicatorConfig.value = JSON.parse(selectedScheme.value.config as string) || []
}
const getSchemeDetail = async (id: number) => {
  const res = await getSchemeDetailApi(id)
  return res.data
}
const saveScheme = async () => {
  if (selectedScheme.value.id) {
    const data = {
      id: selectedScheme.value.id,
      config: JSON.stringify(schemeIndicatorConfig.value),
    }
    const res = await updateSchemeApi(data)
    if (res.status === 200) {
      ElMessage.success('更新方案成功')
    }
  }
}
const removeScheme = () => {
  selectedScheme.value = {}
}
// 二级指标
const addSecondIndicatorDialogOpen = async () => {
  const res = await getIndicatorAndDescendantsApi({ id: selectedScheme.value.indicatorSystem as number })
  const indicatorIdSelectConfig = addSecondIndicatorFormConfig.value.find((item) => item.prop === 'indicatorId')
  indicatorOptions.value = res.data!.map((item) => {
    return {
      label: item.indicatorName,
      value: item.id,
    }
  })
  indicatorIdSelectConfig!.config!.options = indicatorOptions.value
}
const confirmAddChildIndicator = async () => {
  try {
    await addSecondIndicatorRef.value?.ElFormRef?.validate()
    const secondIndicator = {
      ...addSecondIndicatorFormData,
      indicatorName: getIndicatorName(addSecondIndicatorFormData.indicatorId as number),
      level: 0,
      children: [],
    }
    schemeIndicatorConfig.value.push(secondIndicator)
    closeAddChildIndicatorDialog()
  } catch (e) {
    console.error(e)
  }
}
const closeAddChildIndicatorDialog = () => {
  addSecondIndicatorRef.value?.ElFormRef?.resetFields()
  addSecondIndicatorDialogShow.value = false
}

const getIndicatorName = (id: number) => {
  return indicatorOptions.value.find((item) => item.value === id)?.label
}
</script>

<style scoped lang="scss">
.scheme-content {
  overflow-y: auto;

  width: 100%;
  height: calc(100vh - 50px - 2 * $spacing-size5);
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
      color: $main-text-color3;
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

::v-deep(.el-card__body) {
  height: calc(100vh - 50px - 2 * $spacing-size5);
}
</style>
