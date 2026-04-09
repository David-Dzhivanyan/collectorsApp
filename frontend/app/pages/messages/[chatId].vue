<template>
  <container class="chat-page">
    <div class="page-header">
      <nuxt-link to="/messages" class="back-link">← Назад</nuxt-link>
      <div v-if="otherUser" class="chat-header">
        <div class="chat-header__avatar">
          <img
            v-if="otherUser.avatar"
            :src="uploadUrl(otherUser.avatar)"
            class="chat-header__avatar-img"
            alt=""
          />
          <icons-profile v-else class="chat-header__avatar-icon" />
        </div>
        <nuxt-link :to="`/users/${otherUser.id}`" class="chat-header__info">
          <div class="chat-header__name">
            {{ otherUser.firstName }} {{ otherUser.lastName }}
          </div>
          <div class="chat-header__username">@{{ otherUser.username }}</div>
        </nuxt-link>
      </div>
    </div>

    <div ref="messagesContainer" class="messages">
      <div v-if="loading" class="state">Загрузка...</div>

      <template v-else>
        <div
          v-for="msg in currentMessages"
          :key="msg.id"
          class="message"
          :class="{ 'message--own': msg.sender.id === currentUser?.id }"
        >
          <div class="message__bubble">
            <template v-if="msg.type === 'item'">
              <div class="item-card" @click="goToItem(msg)">
                <span class="item-card__label">Предмет коллекции</span>
                <span class="item-card__name">{{ msg.item_name }}</span>
                <span class="item-card__arrow">→ Посмотреть</span>
              </div>
            </template>
            <template v-else>
              {{ msg.content }}
            </template>
          </div>
          <div class="message__time">
            {{ formatTime(msg.created_at) }}
          </div>
        </div>
      </template>
    </div>

    <div class="input-area">
      <input
        v-model="newMessage"
        class="input-area__field"
        type="text"
        placeholder="Написать сообщение..."
        @keydown.enter="sendMessage"
      />
      <ui-btn class="input-area__btn" @click="sendMessage">Отправить</ui-btn>
    </div>
  </container>
</template>

<script setup lang="ts">
import { useChatStore } from '@/store/chat'
import { useUserStore } from '@/store/user'
import { useAuthStore } from '@/store/auth'
import { useUploadUrl } from '@/composables/useUploadUrl'
import type { Message } from '@/types/chat'

const route = useRoute()
const router = useRouter()
const chatId = Number(route.params.chatId)
const uploadUrl = useUploadUrl()

const { isAuth } = storeToRefs(useAuthStore())
const chatStore = useChatStore()
const { currentMessages, chats } = storeToRefs(chatStore)
const { currentUser } = storeToRefs(useUserStore())

const loading = ref(true)
const newMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

const otherUser = computed(() => {
  const chat = chats.value.find((c) => c.id === chatId)
  return chat?.otherUser ?? null
})

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const formatTime = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

const goToItem = (msg: Message) => {
  router.push(
    `/users/${msg.item_owner_id}/collections/${msg.collection_id}?search=${encodeURIComponent(msg.item_name ?? '')}`,
  )
}

const sendMessage = () => {
  if (!newMessage.value.trim()) return
  const { $socket } = useNuxtApp()
  $socket.emit('sendMessage', {
    chatId,
    content: newMessage.value.trim(),
    type: 'text',
  })
  newMessage.value = ''
}

watch(currentMessages, scrollToBottom, { deep: true })

onMounted(async () => {
  if (!isAuth.value) {
    router.push('/')
    return
  }
  await chatStore.fetchChats()
  await chatStore.fetchMessages(chatId)
  await chatStore.markRead(chatId)
  loading.value = false
  scrollToBottom()
})

onUnmounted(() => {
  chatStore.currentChatId = null
})
</script>

<style scoped lang="scss">
.chat-page {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.page-header {
  margin-top: 24px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.back-link {
  font-size: 14px;
  color: $black;
  text-decoration: none;
  opacity: 0.5;
  width: fit-content;

  &:hover { opacity: 1; }
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 12px;

  &__avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: $gray300;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
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

  &__info {
    text-decoration: none;
    transition: opacity 0.15s;

    &:hover { opacity: 0.75; }
  }

  &__name {
    font-weight: 600;
    font-size: 16px;
    color: $gray900;
  }

  &__username {
    font-size: 13px;
    color: $gray600;
  }
}

.messages {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 0 16px;
  max-height: 60vh;
  min-height: 200px;
}

.state {
  text-align: center;
  color: $gray600;
  font-size: 14px;
  padding: 40px 0;
}

.message {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 70%;

  &--own {
    align-self: flex-end;
    align-items: flex-end;

    .message__bubble {
      background: $primary;
      color: #fff;
      border-radius: 16px 16px 4px 16px;
    }
  }

  &__bubble {
    background: $gray200;
    color: $gray900;
    border-radius: 16px 16px 16px 4px;
    padding: 10px 14px;
    font-size: 14px;
    line-height: 1.4;
    word-break: break-word;
  }

  &__time {
    font-size: 11px;
    color: $gray600;
    margin-top: 3px;
    padding: 0 4px;
  }
}

.item-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  min-width: 180px;

  &__label {
    font-size: 11px;
    opacity: 0.7;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__name {
    font-weight: 600;
    font-size: 15px;
  }

  &__arrow {
    font-size: 12px;
    opacity: 0.8;
    margin-top: 2px;
  }
}

.input-area {
  display: flex;
  gap: 8px;
  padding: 12px 0 24px;
  border-top: 1px solid $gray300;

  &__field {
    flex: 1;
    padding: 10px 14px;
    border: 1px solid $gray300;
    border-radius: 8px;
    font-size: 14px;
    color: $gray900;
    background: $white;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;

    &::placeholder { color: $gray600; }

    &:focus {
      border-color: $primary;
      box-shadow: 0 0 0 3px rgba(132, 88, 255, 0.12);
    }
  }

  &__btn {
    flex-shrink: 0;
  }
}
</style>
