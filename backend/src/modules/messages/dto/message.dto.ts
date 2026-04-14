import { IsString, IsOptional, IsEnum, MinLength, IsArray, IsUUID } from 'class-validator';
import { MessageType } from '../entities/message.entity';

export class SendMessageDto {
  @IsUUID()
  conversation_id: string;

  @IsString()
  @MinLength(1)
  content: string;

  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;

  @IsOptional()
  @IsArray()
  attachments?: {
    url: string;
    filename: string;
    size: number;
    mimetype: string;
  }[];
}

export class CreateConversationDto {
  @IsUUID()
  client_id: string;
}

export class MarkReadDto {
  @IsUUID()
  conversation_id: string;
}