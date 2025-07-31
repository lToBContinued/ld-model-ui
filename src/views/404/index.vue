<template>
  <div class="not-found-wrapper user-unselect">
    <p class="not-found-text">404 Not Found</p>
    <p class="jump-page">
      <span class="second">{{ seconds }}</span>
      秒后跳转到首页
    </p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const seconds = ref(6)

const updateCountdown = () => {
  if (seconds.value > 1) {
    seconds.value--
    setTimeout(updateCountdown, 1000)
  } else {
    router.push('/')
    return true
  }
}

onMounted(() => {
  updateCountdown()
})
</script>

<style scoped lang="scss">
.not-found-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100vh;

  .not-found-text {
    font-size: 50px;
    font-weight: 700;
  }

  .jump-page {
    font-size: 18px;
  }

  .second {
    display: inline-block;
    margin-right: $spacing-size2;
    color: $primary-color;
    text-decoration: underline;
  }
}
</style>
