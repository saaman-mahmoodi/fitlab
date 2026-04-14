import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MessagesGateway.name);
  private connectedUsers: Map<string, string> = new Map();

  handleConnection(client: Socket) {
    const userId = client.handshake.auth?.userId || client.handshake.query?.userId;
    if (userId) {
      this.connectedUsers.set(userId, client.id);
      client.join(`user_${userId}`);
      this.logger.log(`User ${userId} connected: ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      if (socketId === client.id) {
        this.connectedUsers.delete(userId);
        client.leave(`user_${userId}`);
        this.logger.log(`User ${userId} disconnected`);
        break;
      }
    }
  }

  sendMessageToUser(userId: string, event: string, data: unknown) {
    this.server.to(`user_${userId}`).emit(event, data);
  }

  sendToConversation(conversationId: string, event: string, data: unknown) {
    this.server.to(`conversation_${conversationId}`).emit(event, data);
  }
}