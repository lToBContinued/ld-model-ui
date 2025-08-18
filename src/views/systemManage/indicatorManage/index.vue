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
            <zk-button type="primary" @click="saveConfig" style="margin-left: auto">保存配置 </zk-button>
          </div>
        </el-col>
      </el-row>
    </zk-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import indicatorTemplate from './indicatorTemplate.json'
import { indicatorConfigFormCofnig } from '@/views/systemManage/indicatorManage/configs/formConfigs.ts'
import ZkForm from '@/components/zk-form.vue'
import AsideTree from '@/views/systemManage/indicatorManage/components/aside-tree.vue'
import { getIndicatorDetail } from '@/api/indicatorManage'
import { RenderContentContext } from 'element-plus'

type Node = RenderContentContext['node']
type Data = RenderContentContext['data']

const indicatorConfigFormData = reactive({
  parent: '',
  indicatorName: '',
  indicatorDesc: '',
  type: '',
  config: JSON.stringify(indicatorTemplate, null, 2),
})

const viewNode = async (data: Data, node: Node) => {
  const self = data
  const parent = node.parent?.data
  const res = await getIndicatorDetail({ nodeId: self.id })
  const { indicatorName, description, type, config, formConfig } = res.data
  indicatorConfigFormData.parent = parent?.label
  indicatorConfigFormData.indicatorName = indicatorName
  indicatorConfigFormData.indicatorDesc = description
  indicatorConfigFormData.type = type
  indicatorConfigFormData.config = config
  indicatorConfigFormData.config = formConfig
}
</script>

<style scoped lang="scss">
.panel {
  display: flex;
  flex-direction: column;
  width: 100%;
}

::v-deep(.el-card__body) {
  height: calc(100vh - 50px - 2 * $spacing-size5);
}

::v-deep(.el-tree-node__content) {
  height: 40px;
}
</style>
