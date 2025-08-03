<template>
  <svg aria-hidden="true" class="svg-icon" :style="{ width: iconSize, height: iconSize }">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon',
  },
  name: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: '16',
  },
})

const symbolId = computed(() => {
  return `#${props.prefix}-${props.name}`
})
const iconSize = computed(() => {
  return `${props.size}px`
})
</script>

<style scoped lang="scss">
.svg-icon {
  overflow: hidden;

  width: 1em;
  height: 1em;

  vertical-align: -0.15em;

  fill: currentcolor;
}
</style>
