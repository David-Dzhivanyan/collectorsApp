<template>
  <div class="layout">
    <MyHeader />
    <slot />
    <Modals />
    <notifications />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'

const { getProfile } = useUserStore()

onMounted(async () => {
  await getProfile()
})
</script>

<style scoped lang="scss">
.layout {
}
</style>
