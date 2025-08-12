<template>
  <div class="container">
    <assess-card :config="collapseConfig"></assess-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { collapseConfig } from '@/views/theoryKnowledge/configs/collapseConfigs.ts'
import AssessCard from '@/views/theoryKnowledge/components/assess-card.vue'

const activeNames = ref([])
</script>

<style scoped lang="scss"></style>
