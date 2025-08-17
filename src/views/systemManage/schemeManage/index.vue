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
            <scheme-collapse v-model="indicatorTreeData"></scheme-collapse>
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
import { reactive, ref } from 'vue'
import { AddSecondIndicatorFormData, BuildSchemeTreeItem, SchemeListItem } from '@/views/systemManage/types.ts'
import { getSchemeDetailApi } from '@/api/schemeManage'
import { Plus } from '@element-plus/icons-vue'
import { addSecondIndicatorFormConfig } from '@/views/systemManage/schemeManage/configs/formConfigs.ts'
import SchemeCollapse from '@/views/systemManage/schemeManage/components/scheme-collapse.vue'
import SchemeList from '@/views/systemManage/schemeManage/components/scheme-list.vue'
import ZkForm from '@/components/zk-form.vue'

const selectedScheme = ref<SchemeListItem>({})
const indicatorTreeData = ref<BuildSchemeTreeItem[]>([])
// 二级指标
const addSecondIndicatorDialogShow = ref(false)
const addSecondIndicatorRef = ref<InstanceType<typeof ZkForm>>()
const addSecondIndicatorFormData = reactive<AddSecondIndicatorFormData>({
  indicatorName: '',
  indicatorDesc: '',
})

// 方案
const schemeChange = async (scheme: SchemeListItem) => {
  selectedScheme.value = scheme
  await getSchemeDetail(scheme.id as string)
}
const getSchemeDetail = async (id: string) => {
  const res = await getSchemeDetailApi(id)
  indicatorTreeData.value = res.data.indicatorList
}
const saveScheme = () => {
  alert(`保存方案：${JSON.stringify(indicatorTreeData.value)}`)
}
const removeScheme = (id: string) => {
  selectedScheme.value = {}
}
// 二级指标
const confirmAddChildIndicator = async () => {
  try {
    await addSecondIndicatorRef.value?.ElFormRef?.validate()
    const secondIndicator = {
      indicatorId: `${Date.now()}`,
      ...addSecondIndicatorFormData,
      level: 1,
      children: [],
    }
    indicatorTreeData.value.push(secondIndicator)
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
  height: calc(100vh - 50px - 2 * $spacing-size5);
  margin-left: $spacing-size2;
  padding: $spacing-size3;

  background-color: #fff;
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
