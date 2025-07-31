<template>
  <div class="statistics-card">
    <zk-card>
      <div class="card-content-wrapper">
        <div class="top">{{ data.title }}</div>
        <div class="center">{{ data.value }}</div>
        <div class="bottom">{{ data.desc }}</div>
      </div>
    </zk-card>
  </div>
</template>

<script setup lang="ts">
interface StatisticsCardPropsType {
  data: {
    title: string
    value: number
    desc: string
  }
}

defineProps<StatisticsCardPropsType>()
</script>

<style scoped lang="scss">
::v-deep(.el-card__body) {
  height: 100%;
}

.card-content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  height: 100%;
}

.top,
.bottom {
  font-size: $font-size-m;
  color: $sub-text-color1;
}

.center {
  font-size: $title-size-s;
  font-weight: 700;
  color: $main-text-color2;
}
</style>
