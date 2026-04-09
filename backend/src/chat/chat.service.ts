import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'
import { ChatEntity } from './entities/chat.entity'
import { MessageEntity } from './entities/message.entity'
import { CreateMessageDto } from './dto/create-message.dto'
import { UsersService } from '../users/users.service'

export type ChatWithMeta = {
  id: number
  otherUser: {
    id: number
    username: string
    firstName: string
    lastName: string
    avatar: string | null
  }
  lastMessage: {
    content: string
    type: 'text' | 'item'
    created_at: Date
  } | null
  unreadCount: number
}

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepo: Repository<ChatEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepo: Repository<MessageEntity>,
    private readonly usersService: UsersService,
  ) {}

  async getChatsForUser(userId: number): Promise<ChatWithMeta[]> {
    const chats = await this.chatRepo.find({
      where: [{ user1: { id: userId } }, { user2: { id: userId } }],
      order: { created_at: 'DESC' },
    })

    const result: ChatWithMeta[] = []

    for (const chat of chats) {
      const otherUser = chat.user1.id === userId ? chat.user2 : chat.user1

      const lastMessage = await this.messageRepo.findOne({
        where: { chat: { id: chat.id } },
        order: { created_at: 'DESC' },
      })

      const unreadCount = await this.messageRepo.count({
        where: {
          chat: { id: chat.id },
          is_read: false,
          sender: { id: Not(userId) },
        },
      })

      result.push({
        id: chat.id,
        otherUser: {
          id: otherUser.id,
          username: otherUser.username,
          firstName: otherUser.firstName,
          lastName: otherUser.lastName,
          avatar: otherUser.avatar ?? null,
        },
        lastMessage: lastMessage
          ? {
              content: lastMessage.content,
              type: lastMessage.type,
              created_at: lastMessage.created_at,
            }
          : null,
        unreadCount,
      })
    }

    return result
  }

  async findOrCreateChat(
    currentUserId: number,
    targetUserId: number,
  ): Promise<ChatEntity> {
    const existing = await this.chatRepo.findOne({
      where: [
        { user1: { id: currentUserId }, user2: { id: targetUserId } },
        { user1: { id: targetUserId }, user2: { id: currentUserId } },
      ],
    })

    if (existing) return existing

    const user1 = await this.usersService.findOne(currentUserId)
    const user2 = await this.usersService.findOne(targetUserId)

    if (!user1 || !user2) throw new NotFoundException('User not found')

    const chat = this.chatRepo.create({ user1, user2 })
    return this.chatRepo.save(chat)
  }

  async getUnreadCount(userId: number): Promise<number> {
    const chats = await this.chatRepo.find({
      where: [{ user1: { id: userId } }, { user2: { id: userId } }],
    })

    if (chats.length === 0) return 0

    let total = 0
    for (const chat of chats) {
      const count = await this.messageRepo.count({
        where: {
          chat: { id: chat.id },
          is_read: false,
          sender: { id: Not(userId) },
        },
      })
      total += count
    }
    return total
  }

  async getMessages(
    chatId: number,
    userId: number,
    page: number,
    limit: number,
  ): Promise<MessageEntity[]> {
    await this.assertParticipant(chatId, userId)
    return this.messageRepo.find({
      where: { chat: { id: chatId } },
      order: { created_at: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    })
  }

  async markRead(chatId: number, userId: number): Promise<void> {
    await this.assertParticipant(chatId, userId)
    await this.messageRepo
      .createQueryBuilder()
      .update(MessageEntity)
      .set({ is_read: true })
      .where(
        'chat_id = :chatId AND sender_id != :userId AND is_read = false',
        { chatId, userId },
      )
      .execute()
  }

  async createMessage(
    dto: CreateMessageDto,
    senderId: number,
  ): Promise<MessageEntity> {
    const chat = await this.assertParticipant(dto.chatId, senderId)
    const sender = await this.usersService.findOne(senderId)
    if (!sender) throw new NotFoundException('Sender not found')

    const message = this.messageRepo.create({
      chat,
      sender,
      content: dto.content,
      type: dto.type,
      item_id: dto.itemId ?? null,
      collection_id: dto.collectionId ?? null,
      item_owner_id: dto.itemOwnerId ?? null,
      item_name: dto.itemName ?? null,
      is_read: false,
    })
    return this.messageRepo.save(message)
  }

  async assertParticipant(chatId: number, userId: number): Promise<ChatEntity> {
    const chat = await this.chatRepo.findOne({
      where: [
        { id: chatId, user1: { id: userId } },
        { id: chatId, user2: { id: userId } },
      ],
    })
    if (!chat) throw new ForbiddenException('Not a participant of this chat')
    return chat
  }
}
