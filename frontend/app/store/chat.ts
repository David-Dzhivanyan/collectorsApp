import type { Chat, Message } from '@/types/chat'

export const useChatStore = defineStore('chat', () => {
  const chats = ref<Chat[]>([])
  const currentMessages = ref<Message[]>([])
  const unreadTotal = ref<number>(0)
  const currentChatId = ref<number | null>(null)

  const fetchChats = async () => {
    const { $axios } = useNuxtApp()
    const { data } = await $axios.get<Chat[]>('/chats')
    chats.value = data
  }

  const fetchOrCreateChat = async (userId: number): Promise<Chat> => {
    const { $axios } = useNuxtApp()
    const { data } = await $axios.post<Chat>('/chats', { userId })
    const idx = chats.value.findIndex((c) => c.id === data.id)
    if (idx === -1) chats.value.unshift(data)
    return data
  }

  const fetchMessages = async (chatId: number) => {
    const { $axios } = useNuxtApp()
    currentChatId.value = chatId
    const { data } = await $axios.get<Message[]>(`/chats/${chatId}/messages`)
    currentMessages.value = data
  }

  const fetchUnreadCount = async () => {
    const { $axios } = useNuxtApp()
    const { data } = await $axios.get<{ count: number }>('/chats/unread-count')
    unreadTotal.value = data.count
  }

  const markRead = async (chatId: number) => {
    const { $axios } = useNuxtApp()
    await $axios.patch(`/chats/${chatId}/read`)
    const chat = chats.value.find((c) => c.id === chatId)
    if (chat) {
      unreadTotal.value = Math.max(0, unreadTotal.value - chat.unreadCount)
      chat.unreadCount = 0
    }
  }

  const addMessage = (message: Message) => {
    if (currentChatId.value === message.chat?.id) {
      currentMessages.value.push(message)
    }
    const chat = chats.value.find((c) => c.id === message.chat?.id)
    if (chat) {
      chat.lastMessage = {
        content: message.content,
        type: message.type,
        created_at: message.created_at,
      }
    }
  }

  const resetState = () => {
    chats.value = []
    currentMessages.value = []
    unreadTotal.value = 0
    currentChatId.value = null
  }

  return {
    chats,
    currentMessages,
    unreadTotal,
    currentChatId,
    fetchChats,
    fetchOrCreateChat,
    fetchMessages,
    fetchUnreadCount,
    markRead,
    addMessage,
    resetState,
  }
})
