<template>
  <div class="module-title">
    <p class="main-title">{{ title }}</p>
    <p class="desc">
      {{ desc }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface moduleTitlePropsType {
  title?: string
  desc?: string
}

withDefaults(defineProps<moduleTitlePropsType>(), {
  title: 'XXX评估系统',
})
</script>

<style scoped lang="scss">
.module-title {
  width: 100%;
  margin-bottom: $spacing-size5;
  padding-bottom: $spacing-size4;
  border-bottom: 1px solid $border-color1;

  .main-title {
    margin-bottom: $spacing-size2;
    font-size: 24px;
    font-weight: 700;
    color: $main-text-color2;
  }

  .desc {
    font-size: $font-size-s;
    color: $sub-text-color3;
  }
}
</style>
