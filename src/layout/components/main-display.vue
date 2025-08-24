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
  opacity: 0;
  transform: translateX(-100px);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateX(0px);
}

.fade-leave-to {
  position: absolute;
  opacity: 0;
  transform: translateX(100px);
}
</style>
