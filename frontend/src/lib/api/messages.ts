import { api } from './client';
import type { Conversation, Message, PaginatedResponse } from '@/types';

export const messagesApi = {
  createConversation: (clientId: string) =>
    api.post<{ success: boolean; data: Conversation }>('/messages/conversations', { client_id: clientId }),
  getConversations: () =>
    api.get<{ success: boolean; data: Conversation[] }>('/messages/conversations'),
  getConversation: (id: string) =>
    api.get<{ success: boolean; data: Conversation }>(`/messages/conversations/${id}`),
  sendMessage: (conversationId: string, content: string, type?: string) =>
    api.post<{ success: boolean; data: Message }>('/messages/send', {
      conversation_id: conversationId,
      content,
      type: type || 'text',
    }),
  getMessages: (conversationId: string, page = 1, limit = 50) =>
    api.get<PaginatedResponse<Message>>(`/messages/conversations/${conversationId}/messages?page=${page}&limit=${limit}`),
  markAsRead: (conversationId: string) =>
    api.post<{ success: boolean; data: { message: string } }>('/messages/read', { conversation_id: conversationId }),
  getUnreadCount: () =>
    api.get<{ success: boolean; data: { count: number } }>('/messages/unread-count'),
};