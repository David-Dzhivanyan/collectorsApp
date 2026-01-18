<template>
  <div class="layout">
    <div class="content">
      <MyHeader />
      <slot />
      <my-footer />
    </div>
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
  min-height: 100vh;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  min-height: 100vh;
}
</style>
