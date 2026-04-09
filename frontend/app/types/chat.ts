export type ChatUser = {
  id: number
  username: string
  firstName: string
  lastName: string
  avatar: string | null
}

export type LastMessage = {
  content: string
  type: 'text' | 'item'
  created_at: string
}

export type Chat = {
  id: number
  otherUser: ChatUser
  lastMessage: LastMessage | null
  unreadCount: number
}

export type Message = {
  id: number
  chat: { id: number }
  sender: ChatUser
  content: string
  type: 'text' | 'item'
  item_id: number | null
  collection_id: number | null
  item_owner_id: number | null
  item_name: string | null
  is_read: boolean
  created_at: string
}
