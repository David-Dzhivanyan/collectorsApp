import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { JwtService } from '@nestjs/jwt'
import { UsePipes, ValidationPipe } from '@nestjs/common'
import { ChatService } from './chat.service'
import { CreateMessageDto } from './dto/create-message.dto'

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      const cookieHeader = client.handshake.headers.cookie ?? ''
      const jwtCookie = cookieHeader
        .split(';')
        .map((c) => c.trim())
        .find((c) => c.startsWith('jwt='))

      if (!jwtCookie) throw new Error('No JWT cookie')

      const token = jwtCookie.split('=')[1]
      const payload = this.jwtService.verify(token)

      client.data.userId = payload.id
      await client.join(`user:${payload.id}`)
    } catch {
      client.disconnect()
    }
  }

  handleDisconnect(_client: Socket): void {
    // nothing to clean up
  }

  @SubscribeMessage('sendMessage')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async handleSendMessage(
    @MessageBody() dto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const senderId: number = client.data.userId
    if (!senderId) {
      client.disconnect()
      return
    }

    const message = await this.chatService.createMessage(dto, senderId)

    const recipientId =
      message.chat.user1.id === senderId
        ? message.chat.user2.id
        : message.chat.user1.id

    this.server.to(`user:${senderId}`).emit('newMessage', { message })
    this.server.to(`user:${recipientId}`).emit('newMessage', { message })

    const count = await this.chatService.getUnreadCount(recipientId)
    this.server.to(`user:${recipientId}`).emit('unreadUpdate', { count, chatId: dto.chatId })
  }
}
