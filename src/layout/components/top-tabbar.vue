<template>
  <div class="tabbar-wrapper">
    <div class="left">
      <el-icon class="expand-fold cursor-pointer" size="20" color="#666" @click="changeMenuMode">
        <component :is="settingStore.isCollapse ? Expand : Fold"></component>
      </el-icon>
    </div>
    <div class="right">
      <el-icon class="fullscreen right-item forbid-user-select cursor-pointer" size="20" @click="changeFullScreen">
        <i-ep-FullScreen />
      </el-icon>
    </div>
  </div>
</template>

<script setup>
import { Expand } from '@element-plus/icons-vue'
import { Fold } from '@element-plus/icons-vue'
import useSettingStore from '@/stores/modules/setting.js'

const settingStore = useSettingStore()

const changeMenuMode = () => {
  settingStore.changeMenuCollapse()
}
// 全屏
const changeFullScreen = () => {
  let full = document.fullscreenElement // dom对象的全屏状态（布尔值）
  if (!full) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
</script>

<style lang="scss">
.tabbar-wrapper {
  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  height: 50px;
  padding: $spacing-size2 $spacing-size4;

  background-color: #001529;
  box-shadow: 0 4px 9px 0 rgb(100 100 111 / 14%);
}

.right {
  display: flex;
  align-items: center;

  .right-item {
    margin-left: $spacing-size3;
    font-size: $font-size-l;
    font-weight: 700;
  }
}
</style>
