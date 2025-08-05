<template>
  <div class="system-notice">
    <svg-icon name="overview" size="40" @click="isShow = true"></svg-icon>
    <zk-dialog :model-value="isShow" :show-footer="false" @close="isShow = false">
      <div class="title-wrapper">
        <h1 class="title">XXXX评估系统概述</h1>
        <p class="desc">本系统旨在为组织提供一套全面、科学的XXXX评估解决方案，帮助管理者识别、培养和留住关键人才。</p>
      </div>
      <div class="key-features-wrapper">
        <h2 class="module-title">系统主要功能</h2>
        <ul class="key-features-list list">
          <li class="list-item">
            <span class="item-title">多维度评估</span>
            - 提供8个核心评估指标，全面覆盖人才能力各个方面
          </li>
          <li class="list-item">
            <span class="item-title">专业评估模型</span>
            - 基于行业最佳实践设计的科学评估体系
          </li>
          <li class="list-item">
            <span class="item-title">可视化分析</span>
            - 通过图表直观展示评估结果和趋势
          </li>
          <li class="list-item">
            <span class="item-title">数据筛选</span>
            - 支持按人员、时间、指标等多维度筛选
          </li>
          <li class="list-item">
            <span class="item-title">报告导出</span>
            - 支持按模板导出评估结果报告
          </li>
          <li class="list-item">
            <span class="item-title">历史记录</span>
            - 完整保存评估历史，支持纵向对比分析
          </li>
        </ul>
      </div>
      <div class="meaning-and-value">
        <h2 class="module-title">本系统能够帮助组织：</h2>
        <p></p>
        <ul class="meaning-and-value-list list">
          <li class="list-item">科学识别高潜力人才，为人才梯队建设提供依据</li>
          <li class="list-item">客观评估员工能力短板，制定精准培训计划</li>
          <li class="list-item">建立人才数据库，支持人才盘点与继任计划</li>
          <li class="list-item">量化人才价值，为薪酬激励提供数据支持</li>
          <li class="list-item">提升人才管理效率，降低人才流失风险</li>
        </ul>
      </div>
      <div class="usage-guide">
        <h2 class="module-title">使用指南</h2>
        <ol class="usage-guide-list list">
          <li class="list-item">科学识别高潜力人才，为人才梯队建设提供依据</li>
          <li class="list-item">客观评估员工能力短板，制定精准培训计划</li>
          <li class="list-item">建立人才数据库，支持人才盘点与继任计划</li>
          <li class="list-item">量化人才价值，为薪酬激励提供数据支持</li>
          <li class="list-item">提升人才管理效率，降低人才流失风险</li>
        </ol>
      </div>
    </zk-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isShow = ref(true)
</script>

<style scoped lang="scss">
.system-notice {
  @include flex-center(row-center);

  cursor: pointer;

  position: fixed;
  z-index: 999;
  top: 20px;
  right: 50px;

  width: 50px;
  height: 50px;
}

.title-wrapper {
  margin-bottom: $spacing-size4;

  .title {
    font-size: $title-size-l;
    color: #004591ff;
  }

  .desc {
    font-size: $font-size-m;
    color: $main-text-color2;
  }
}

.module-title {
  margin-top: $spacing-size3;
  margin-bottom: $spacing-size1;
  font-size: $title-size-s;
  color: $main-text-color2;
}

.list {
  padding-left: $spacing-size5;
}

ul {
  font-size: $font-size-m;
  color: $main-text-color2;
  list-style-type: disc;
}

ol {
  font-size: $font-size-m;
  color: $main-text-color2;
  list-style-type: decimal;
}

.list-item {
  line-height: 2.5rem;
}

.key-features-wrapper {
  .item-title {
    padding: $spacing-size1;
    background-color: #eaf4fb;
  }
}

::v-deep(.svg-icon) {
  transition: all 0.3s;

  &:hover {
    width: 45px !important;
    height: 45px !important;
  }
}

::v-deep(.el-dialog__body) {
  overflow-y: auto;
  max-height: 70vh;
  padding-right: 10px;
}
</style>
