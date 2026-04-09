import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Req,
  UseGuards,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { ChatService } from './chat.service'
import type { RequestWithUser } from '../collection/collection.controller'

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getMyChats(@Req() req: RequestWithUser) {
    return this.chatService.getChatsForUser(req.user.id)
  }

  @Post()
  async findOrCreateChat(
    @Body('userId', ParseIntPipe) userId: number,
    @Req() req: RequestWithUser,
  ) {
    return this.chatService.findOrCreateChat(req.user.id, userId)
  }

  @Get('unread-count')
  async getUnreadCount(
    @Req() req: RequestWithUser,
  ): Promise<{ count: number }> {
    const count = await this.chatService.getUnreadCount(req.user.id)
    return { count }
  }

  @Get(':id/messages')
  async getMessages(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    return this.chatService.getMessages(id, req.user.id, page, limit)
  }

  @Patch(':id/read')
  async markRead(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    await this.chatService.markRead(id, req.user.id)
  }
}
