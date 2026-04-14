import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message, MessageType } from './entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { SendMessageDto, CreateConversationDto } from './dto';
import { Client } from '../clients/entities/client.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
    @InjectRepository(Conversation)
    private conversationRepo: Repository<Conversation>,
    @InjectRepository(Client)
    private clientRepo: Repository<Client>,
  ) {}

  async createConversation(coachUserId: string, dto: CreateConversationDto): Promise<Conversation> {
    const client = await this.clientRepo.findOne({ where: { id: dto.client_id } });
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    if (client.coach_id !== coachUserId) {
      throw new ForbiddenException('This client does not belong to you');
    }

    const existing = await this.conversationRepo.findOne({
      where: { coach_id: coachUserId, client_id: dto.client_id },
    });
    if (existing) {
      return existing;
    }

    const conversation = this.conversationRepo.create({
      coach_id: coachUserId,
      client_id: dto.client_id,
    });
    return this.conversationRepo.save(conversation);
  }

  async getConversations(userId: string): Promise<Conversation[]> {
    return this.conversationRepo
      .createQueryBuilder('conv')
      .where('conv.coach_id = :userId OR conv.client_id = :userId', { userId })
      .orderBy('conv.last_message_at', 'DESC')
      .getMany();
  }

  async getConversationById(id: string, userId: string): Promise<Conversation> {
    const conversation = await this.conversationRepo.findOne({ where: { id } });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    if (conversation.coach_id !== userId && conversation.client_id !== userId) {
      throw new ForbiddenException('Not part of this conversation');
    }
    return conversation;
  }

  async sendMessage(senderId: string, dto: SendMessageDto): Promise<Message> {
    const conversation = await this.conversationRepo.findOne({
      where: { id: dto.conversation_id },
    });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    if (conversation.coach_id !== senderId && conversation.client_id !== senderId) {
      throw new ForbiddenException('Not part of this conversation');
    }

    const message = this.messageRepo.create({
      conversation_id: dto.conversation_id,
      sender_id: senderId,
      content: dto.content,
      type: dto.type ?? MessageType.TEXT,
      attachments: dto.attachments ?? undefined,
    });

    const saved = await this.messageRepo.save(message);

    await this.conversationRepo.update(dto.conversation_id, {
      last_message_at: new Date(),
    });

    return saved;
  }

  async getMessages(conversationId: string, userId: string, page = 1, limit = 50): Promise<[Message[], number]> {
    const conversation = await this.conversationRepo.findOne({
      where: { id: conversationId },
    });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    if (conversation.coach_id !== userId && conversation.client_id !== userId) {
      throw new ForbiddenException('Not part of this conversation');
    }

    return this.messageRepo.findAndCount({
      where: { conversation_id: conversationId },
      order: { timestamp: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async markAsRead(conversationId: string, userId: string): Promise<void> {
    await this.messageRepo
      .createQueryBuilder()
      .update(Message)
      .set({ read: true, read_at: new Date() })
      .where('conversation_id = :conversationId', { conversationId })
      .andWhere('sender_id != :userId', { userId })
      .andWhere('read = false')
      .execute();
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.messageRepo
      .createQueryBuilder('msg')
      .where('msg.read = false')
      .andWhere('msg.sender_id != :userId', { userId })
      .getCount();
  }

  async findOrCreateConversation(coachId: string, clientId: string): Promise<Conversation> {
    let conversation = await this.conversationRepo.findOne({
      where: { coach_id: coachId, client_id: clientId },
    });

    if (!conversation) {
      conversation = this.conversationRepo.create({
        coach_id: coachId,
        client_id: clientId,
      });
      conversation = await this.conversationRepo.save(conversation);
    }

    return conversation;
  }
}