<template>
  <Swiper
    :modules="[Pagination, Autoplay]"
    :slides-per-view="1"
    :space-between="20"
    navigation
    pagination
    :autoplay="{ delay: 3000 }"
    loop
  >
    <slot />
  </Swiper>
</template>

<script setup lang="ts">
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper } from 'swiper/vue'

import 'swiper/css'
import 'swiper/css/pagination'
</script>

<style scoped>
</style>
