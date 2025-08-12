<template>
  <div>
    <template v-for="level in config" :key="level.id">
      <div :class="`assess-card-${level.level}`">
        <template v-if="level.children && level.children.length > 0">
          <div class="title" :class="`title-${level.level}`">{{ level.label }}</div>
          <assess-card :config="level.children"></assess-card>
        </template>
        <template v-else>
          <div style="width: 200px">
            <zk-form v-model:form-config="level.formConfig" label-width="100" label-position="left"></zk-form>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface AssessCardProps {
  config: Record<string, any>[]
}

const props = withDefaults(defineProps<AssessCardProps>(), {})
const formData = ref({})

onMounted(() => {
  props.config.forEach((item) => {
    if (item.formConfig) {
      console.log('>>>>> file: assess-card.vue ~ method:  <<<<<\n', item.formConfig) // TODO: 删除
    }
  })
})
</script>

<style scoped lang="scss">
.assess-card-1 {
  margin-bottom: 24px;
  border: 1px solid red;
}
.assess-card-2 {
  padding-left: 16px;
}
.assess-card-3 {
  padding-left: 32px;
}
.title {
  font-size: 16px;
}
.title-1 {
  font-size: 22px;
  font-weight: 700;
}
::v-deep(.el-form-item__label) {
  color: #000;
  font-size: 16px;
}
</style>
