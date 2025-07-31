<template>
  <template v-for="item in menuList" :key="item.path">
    <el-menu-item
      :index="item.path"
      v-if="!item.children && !item.meta?.hidden"
      @click="goRoute"
      :disabled="item.meta?.disabled"
    >
      <svg-icon v-if="item.iconShow" :name="item.meta?.icon" size="20"></svg-icon>
      <template #title>
        <span class="menu-item-title forbid-user-select">{{ item.meta?.title }}</span>
      </template>
    </el-menu-item>
    <el-menu-item
      v-if="item.children && item.children?.length === 1 && !item.children[0].meta?.hidden"
      :index="item.children[0].path"
      @click="goRoute"
      :disabled="item.meta?.disabled"
    >
      <svg-icon v-if="item.iconShow" :name="item.children[0].meta?.icon" size="20"></svg-icon>
      <template #title>
        <span class="menu-item-title forbid-user-select">{{ item.children[0].meta?.title }}</span>
      </template>
    </el-menu-item>
    <el-sub-menu v-if="item.children && item.children?.length >= 2" :index="item.path">
      <template #title>
        <svg-icon v-if="item.iconShow" :name="item.meta?.icon" size="20"></svg-icon>
        <span class="menu-item-title forbid-user-select">{{ item.meta?.title }}</span>
      </template>
      <aside-menu :menuList="item.children"></aside-menu>
    </el-sub-menu>
  </template>
</template>

<script setup>
import { useRouter } from 'vue-router'

defineOptions({
  name: 'aside-menu',
})

defineProps({
  // 菜单列表
  menuList: {
    type: Array,
    default: () => [],
  },
})

const $router = useRouter()

// 菜单跳转对应路由
const goRoute = (vc) => {
  $router.push(vc.index)
}
</script>

<style scoped lang="scss">
.menu-item-title {
  padding-left: $spacing-size2;
}
</style>
