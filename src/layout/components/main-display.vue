<template>
  <router-view v-slot="{ Component, route }">
    <transition name="fade">
      <keep-alive :include="cacheList">
        <component :is="Component" :key="route.fullPath"></component>
      </keep-alive>
    </transition>
  </router-view>
</template>

<script setup>
import { ref } from 'vue'

const cacheList = ref(['runAssess'])
</script>

<style scoped lang="scss">
.fade-enter-from {
  position: absolute;
  transform: translateX(-100px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}

.fade-enter-to,
.fade-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.fade-leave-to {
  position: absolute;
  transform: translateX(100px);
  opacity: 0;
}
</style>
