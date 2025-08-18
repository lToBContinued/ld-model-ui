<template>
  <div class="indicatorManage">
    <zk-card>
      <el-row>
        <el-col :span="10">
          <aside-tree @view-node="viewNode"></aside-tree>
        </el-col>
        <el-col :span="14">
          <div class="panel">
            <zk-form
              v-model:form-data="indicatorConfigFormData"
              v-model:form-config="indicatorConfigFormCofnig"
              label-width="80"
            ></zk-form>
            <zk-button style="margin-left: auto" type="primary" @click="saveConfig">保存配置 </zk-button>
          </div>
        </el-col>
      </el-row>
    </zk-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { indicatorConfigFormCofnig } from '@/views/systemManage/indicatorManage/configs/formConfigs.ts'
import ZkForm from '@/components/zk-form.vue'
import AsideTree from '@/views/systemManage/indicatorManage/components/aside-tree.vue'
import { getIndicatorDetail } from '@/api/indicatorManage'
import { RenderContentContext } from 'element-plus'
import { IndicatorConfigFormData } from '@/views/systemManage/types.ts'

type Node = RenderContentContext['node']
type Data = RenderContentContext['data']

const indicatorConfigFormData = reactive<IndicatorConfigFormData>({
  config: '',
  indicatorDesc: '',
  indicatorName: '',
  isLeaf: 0,
  parentName: '',
})

const viewNode = async (data: Data, _: Node) => {
  const res = await getIndicatorDetail({ id: data.id })
  const { config, indicatorDesc, indicatorName, isLeaf, parentName } = res.data!
  Object.assign(indicatorConfigFormData, {
    config,
    indicatorDesc,
    indicatorName,
    isLeaf,
    parentName,
  })
}
const saveConfig = () => {
  console.log('>>>>> file: index.vue ~ method: saveConfig <<<<<\n', indicatorConfigFormData) // TODO: 删除
}
</script>

<style scoped lang="scss">
.panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-left: $spacing-size2;
}

::v-deep(.el-card__body) {
  height: calc(100vh - 50px - 2 * $spacing-size5);
}

::v-deep(.el-tree-node__content) {
  height: 40px;
}
</style>
