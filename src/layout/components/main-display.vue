<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component"></component>
    </transition>
  </router-view>
</template>

<script setup></script>

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
