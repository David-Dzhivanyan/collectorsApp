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
import { useAuthStore } from '@/store/auth'
import { useChatStore } from '@/store/chat'

const { getProfile } = useUserStore()
const { isAuth } = storeToRefs(useAuthStore())

onMounted(async () => {
  await getProfile()
  if (isAuth.value) {
    const chatStore = useChatStore()
    chatStore.fetchUnreadCount()
    const { $socket } = useNuxtApp()
    $socket.connect()
  }
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
