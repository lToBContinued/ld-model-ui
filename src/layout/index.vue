k
<template>
  <div class="layout">
    <el-container>
      <el-aside :style="{ width: settingStore.isCollapse ? '80px' : '240px' }" style="height: 100vh">
        <el-menu
          background-color="#f9f9f9"
          text-color="#fff"
          active-text-color="#ffd04b"
          :default-active="$route.path"
          :collapse="settingStore.isCollapse"
        >
          <system-title v-if="!settingStore.isCollapse"></system-title>
          <aside-menu :menuList="routes"></aside-menu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <top-tabbar class="tabbar"></top-tabbar>
          <main-display></main-display>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import useSettingStore from '@/stores/modules/setting.ts'
// import TopTabbar from '@/layout/components/top-tabbar.vue'
import MainDisplay from '@/layout/components/main-display.vue'
import SystemTitle from '@/layout/components/system-title.vue'
import AsideMenu from '@/layout/components/aside-menu.vue'
import TopTabbar from '@/layout/components/top-tabbar.vue'
import useMenuStore from '@/stores/modules/menu.ts'
import routes from '@/router/routes.ts'

const settingStore = useSettingStore()
const menuStore = useMenuStore()
</script>

<style scoped lang="scss">
.common-layout {
  height: 100vh;
}

::v-deep(.el-aside) {
  user-select: none;

  z-index: 999;

  overflow-x: hidden;

  height: 100vh;
  padding: 0;

  background-color: $primary-color;
}

::v-deep(.el-menu) {
  background-color: $primary-color;
  border: none;

  .el-sub-menu__title:hover {
    background-color: #85a9dd;
  }

  .el-menu-item:hover {
    background-color: #85a9dd;
  }

  .is-active {
    background-color: #5889d0;
  }

  .menu-item-title {
    font-size: $font-size-m;
  }
}

::v-deep(.el-container) {
  height: 100vh;

  .el-header {
    z-index: 998;
    padding: 0;
  }
}

::v-deep(.el-main) {
  position: relative;
  width: calc(100% - $aside-width);
  padding: calc(50px + $spacing-size5) $spacing-size5 $spacing-size5;

  // 背景颜色
  background: $main-bg-color;
}
</style>
