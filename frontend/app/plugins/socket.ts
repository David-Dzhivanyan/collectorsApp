import { io, type Socket } from 'socket.io-client'
import { useChatStore } from '@/store/chat'

export default defineNuxtPlugin(() => {
  let socket: Socket | null = null

  const connect = () => {
    if (socket?.connected) return

    socket = io('http://localhost:3001', {
      withCredentials: true,
    })

    socket.on('newMessage', ({ message }) => {
      useChatStore().addMessage(message)
    })

    socket.on('unreadUpdate', ({ count, chatId }: { count: number; chatId: number }) => {
      const chatStore = useChatStore()
      if (chatStore.currentChatId === chatId) return
      chatStore.unreadTotal = count
    })
  }

  const disconnect = () => {
    socket?.disconnect()
    socket = null
  }

  const emit = (event: string, data: unknown) => {
    socket?.emit(event, data)
  }

  return {
    provide: {
      socket: { connect, disconnect, emit },
    },
  }
})
