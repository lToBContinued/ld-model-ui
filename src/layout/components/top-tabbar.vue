<template>
  <div class="tabbar-wrapper">
    <div class="left">
      <!--<el-icon class="expand-fold cursor-pointer" size="20" color="#666" @click="changeMenuMode">-->
      <!--  <component :is="settingStore.isCollapse ? Expand : Fold"></component>-->
      <!--</el-icon>-->
      <el-icon class="fullscreen right-item forbid-user-select cursor-pointer" size="20" @click="changeFullScreen">
        <i-ep-FullScreen />
      </el-icon>
      <system-notice></system-notice>
    </div>
    <div class="right">
      <el-dropdown>
        <div class="username-wrapper">
          <span class="username bold">{{ userStore.username }}</span>
          <el-icon><ArrowDownBold /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="userLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
// import { Expand } from '@element-plus/icons-vue'
// import { Fold } from '@element-plus/icons-vue'
// import useSettingStore from '@/stores/modules/setting.js'
import SystemNotice from '@/layout/components/system-notice.vue'
import useUserStore from '@/stores/modules/user.js'
import { ArrowDownBold } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

// const settingStore = useSettingStore()
const router = useRouter()
const userStore = useUserStore()

/*const changeMenuMode = () => {
  settingStore.changeMenuCollapse()
}*/
// 全屏
const changeFullScreen = () => {
  let full = document.fullscreenElement // dom对象的全屏状态（布尔值）
  if (!full) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
// 退出登录
const userLogout = async () => {
  try {
    await userStore.logout()
    ElMessage.success('退出登录成果')
    router.push({ name: 'login' })
  } catch (e) {
    ElMessage.error('退出登录失败，请重试')
    console.log(e)
  }
}
</script>

<style lang="scss">
.tabbar-wrapper {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 240px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  width: calc(100% - 240px);
  height: 50px;
  padding: $spacing-size2 $spacing-size4;

  background-color: #fff;
  box-shadow: 0 4px 9px 0 rgb(100 100 111 / 14%);
}

.left {
  display: flex;
  align-items: center;

  .right-item {
    margin-left: $spacing-size3;
    font-size: $font-size-l;
    font-weight: 700;
  }
}

.right {
  .username {
    margin-right: $spacing-size2;
    font-size: $font-size-m;
    color: $main-text-color1;
  }
}
</style>
