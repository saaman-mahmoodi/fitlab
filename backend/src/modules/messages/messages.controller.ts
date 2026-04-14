import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, CurrentUser } from '../../common/decorators';
import { SendMessageDto, CreateConversationDto, MarkReadDto } from './dto';
import { MessagesGateway } from './gateway/messages.gateway';
import { UserRole } from '../users/entities/user.entity';

@Controller('messages')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MessagesController {
  constructor(
    private messagesService: MessagesService,
    private messagesGateway: MessagesGateway,
  ) {}

  @Post('conversations')
  async createConversation(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateConversationDto,
  ) {
    return this.messagesService.createConversation(userId, dto);
  }

  @Get('conversations')
  async getConversations(@CurrentUser('id') userId: string) {
    return this.messagesService.getConversations(userId);
  }

  @Get('conversations/:id')
  async getConversation(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.messagesService.getConversationById(id, userId);
  }

  @Post('send')
  async sendMessage(
    @CurrentUser('id') userId: string,
    @Body() dto: SendMessageDto,
  ) {
    const message = await this.messagesService.sendMessage(userId, dto);

    const conversation = await this.messagesService.getConversationById(
      dto.conversation_id,
      userId,
    );

    const receiverId =
      conversation.coach_id === userId
        ? conversation.client_id
        : conversation.coach_id;

    this.messagesGateway.sendMessageToUser(receiverId, 'new_message', message);
    this.messagesGateway.sendMessageToUser(userId, 'message_sent', message);

    return message;
  }

  @Get('conversations/:id/messages')
  async getMessages(
    @CurrentUser('id') userId: string,
    @Param('id') conversationId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const [messages, total] = await this.messagesService.getMessages(
      conversationId,
      userId,
      page ?? 1,
      limit ?? 50,
    );
    return {
      items: messages,
      total,
      page: page ?? 1,
      limit: limit ?? 50,
      totalPages: Math.ceil(total / (limit ?? 50)),
    };
  }

  @Post('read')
  async markAsRead(
    @CurrentUser('id') userId: string,
    @Body() dto: MarkReadDto,
  ) {
    await this.messagesService.markAsRead(dto.conversation_id, userId);

    const conversation = await this.messagesService.getConversationById(
      dto.conversation_id,
      userId,
    );
    const otherUserId =
      conversation.coach_id === userId
        ? conversation.client_id
        : conversation.coach_id;
    this.messagesGateway.sendMessageToUser(otherUserId, 'messages_read', {
      conversation_id: dto.conversation_id,
      read_by: userId,
    });

    return { message: 'Messages marked as read' };
  }

  @Get('unread-count')
  async getUnreadCount(@CurrentUser('id') userId: string) {
    const count = await this.messagesService.getUnreadCount(userId);
    return { count };
  }
}