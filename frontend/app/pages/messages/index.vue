<template>
  <container>
    <div class="page-header">
      <h1 class="title">Сообщения</h1>
    </div>

    <div v-if="loading" class="state">Загрузка...</div>
    <div v-else-if="chats.length === 0" class="state">Нет диалогов</div>

    <div v-else class="list">
      <div
        v-for="chat in chats"
        :key="chat.id"
        class="chat-row"
        @click="router.push(`/messages/${chat.id}`)"
      >
        <div class="chat-row__avatar">
          <img
            v-if="chat.otherUser.avatar"
            :src="uploadUrl(chat.otherUser.avatar)"
            class="chat-row__avatar-img"
            alt=""
          />
          <icons-profile v-else class="chat-row__avatar-icon" />
        </div>

        <div class="chat-row__body">
          <div class="chat-row__top">
            <span class="chat-row__name">
              {{ chat.otherUser.firstName }} {{ chat.otherUser.lastName }}
            </span>
            <span v-if="chat.lastMessage" class="chat-row__time">
              {{ formatTime(chat.lastMessage.created_at) }}
            </span>
          </div>
          <div class="chat-row__bottom">
            <span class="chat-row__preview">
              <template v-if="!chat.lastMessage">Нет сообщений</template>
              <template v-else-if="chat.lastMessage.type === 'item'">
                📦 {{ chat.lastMessage.content }}
              </template>
              <template v-else>{{ chat.lastMessage.content }}</template>
            </span>
            <span v-if="chat.unreadCount > 0" class="chat-row__badge">
              {{ chat.unreadCount }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </container>
</template>

<script setup lang="ts">
import { useChatStore } from '@/store/chat'
import { useAuthStore } from '@/store/auth'
import { useUploadUrl } from '@/composables/useUploadUrl'

const router = useRouter()
const { isAuth } = storeToRefs(useAuthStore())
const chatStore = useChatStore()
const { chats } = storeToRefs(chatStore)
const uploadUrl = useUploadUrl()

const loading = ref(true)

const formatTime = (dateStr: string) => {
  const d = new Date(dateStr)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

onMounted(async () => {
  if (!isAuth.value) {
    router.push('/')
    return
  }
  await chatStore.fetchChats()
  loading.value = false
})
</script>

<style scoped lang="scss">
.page-header {
  margin-top: 24px;
  margin-bottom: 20px;
}

.title {
  font-size: 22px;
  font-weight: 700;
  color: $gray900;
  margin: 0;
}

.state {
  text-align: center;
  color: $gray600;
  font-size: 14px;
  padding: 60px 0;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chat-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: $gray200;
  }

  &__avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: $gray300;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 8px;
  }

  &__avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  &__avatar-icon {
    width: 100%;
    height: 100%;
    fill: $gray600;
  }

  &__body {
    flex: 1;
    min-width: 0;
  }

  &__top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 8px;
  }

  &__name {
    font-weight: 600;
    font-size: 15px;
    color: $gray900;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__time {
    font-size: 12px;
    color: $gray600;
    flex-shrink: 0;
  }

  &__bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-top: 2px;
  }

  &__preview {
    font-size: 13px;
    color: $gray600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__badge {
    background: $primary;
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    border-radius: 10px;
    padding: 1px 6px;
    min-width: 18px;
    text-align: center;
    flex-shrink: 0;
  }
}
</style>
