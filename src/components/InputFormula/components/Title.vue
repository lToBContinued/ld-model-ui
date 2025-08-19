<script setup lang="ts">
//import {defineProps,defineEmits, ref} from 'vue'
import {ref} from 'vue'
import {InputSearch, Row, Button} from 'ant-design-vue'
import { CloseOutlined } from '@ant-design/icons-vue';

const emits = defineEmits(['handleSearch', 'handleReset'])
const props = defineProps({
  title: {
    type: String,
    default: '标题'
  },
  isSearch: {
    type: Boolean,
    default: true
  },
  searchPlaceholder: {
    type: String,
    default: '请输入'
  },
  // 添加重置按钮显示控制
  showReset: {
    type: Boolean,
    default: false
  }
})
const searchText = ref('')
const onSearch = () => {
  emits('handleSearch', searchText.value)
}

// 新增重置方法
const onReset = () => {
  searchText.value = ''
  emits('handleReset')
}
</script>

<template>
  <Row
      class="title"
      :style="{height:props.isSearch?'60px':'30px'}"
  >
    <h1>
      {{ props.title }}
    </h1>
    <div v-if="props.isSearch" class="search-container">
      <InputSearch
          v-model:value="searchText"
          :placeholder="props.searchPlaceholder"
          style="zoom:.9;"
          @search="onSearch"
      />
      <Button
          v-if="props.showReset"
          size="small"
          @click="onReset"
          class="clear-btn"
      >
        <CloseOutlined />
      </Button>
    </div>
  </Row>
</template>

<style lang="scss" scoped>
.title {
  width: 100%;
  display: flex;
  flex-direction: column;
  h1 {
    width: 100%;
    font-size: 14px;
    height: 30px;
    line-height: 16px;
    margin: -8px 0 0 0;
    padding: 0;
    display: flex;
    align-items: center;
  }
}

// 新增搜索容器样式
.search-container {
  display: flex;
  align-items: center;
  width: 100%;

  :deep(.ant-input-search) {
    flex: 1;
  }
  .clear-btn {
    margin-left: 2px;
    padding: 0;
    height: 100%;
    width: 25px;
  }
}
</style>
