'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagesApi } from '@/lib/api/messages';
import { clientApi } from '@/lib/api/resources';
import { useSocket } from '@/hooks/use-socket';
import { useAuthStore } from '@/stores/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MessageSquare, Send, Plus, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import type { Conversation, Message, Client } from '@/types';

export default function MessagesPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { on } = useSocket();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [realtimeMessages, setRealtimeMessages] = useState<Message[]>([]);

  const { data: conversationsData, isLoading: loadingConversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => messagesApi.getConversations(),
  });

  const { data: clientsData } = useQuery({
    queryKey: ['clients-for-messages'],
    queryFn: () => clientApi.list(1, 100),
  });

  const { data: messagesData, isLoading: loadingMessages } = useQuery({
    queryKey: ['messages', selectedConversation],
    queryFn: () => messagesApi.getMessages(selectedConversation!),
    enabled: !!selectedConversation,
  });

  const sendMessageMutation = useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: string; content: string }) =>
      messagesApi.sendMessage(conversationId, content),
    onSuccess: (response) => {
      const newMsg = response.data;
      setRealtimeMessages((prev) => [...prev, newMsg]);
      setMessageInput('');
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  const createConversationMutation = useMutation({
    mutationFn: (clientId: string) => messagesApi.createConversation(clientId),
    onSuccess: (response) => {
      const conv = response.data;
      setSelectedConversation(conv.id);
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  useEffect(() => {
    const cleanup = on('new_message', (data: unknown) => {
      const msg = data as Message;
      if (msg.conversation_id === selectedConversation) {
        setRealtimeMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    });
    return cleanup;
  }, [on, selectedConversation, queryClient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [realtimeMessages, messagesData]);

  useEffect(() => {
    setRealtimeMessages([]);
  }, [selectedConversation]);

  const conversations = (conversationsData?.data ?? []) as Conversation[];
  const messages = [...(messagesData?.data?.items ?? []), ...realtimeMessages];
  const clients = useMemo(() => (clientsData?.data?.items ?? []) as Client[], [clientsData]);

  const getClientName = useCallback((clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client?.user?.name || 'Unknown Client';
  }, [clients]);

  const handleSend = () => {
    if (!selectedConversation || !messageInput.trim()) return;
    sendMessageMutation.mutate({
      conversationId: selectedConversation,
      content: messageInput.trim(),
    });
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      <div className={cn(
        'w-full md:w-80 flex-shrink-0',
        selectedConversation && 'hidden md:block',
      )}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <Button
            size="sm"
            className="bg-[#0A3AFF] hover:bg-blue-700"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </div>

        {loadingConversations ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0A3AFF]" />
          </div>
        ) : conversations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <MessageSquare className="h-10 w-10 text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No conversations yet</p>
            </CardContent>
          </Card>
        ) : (
          <ScrollArea className="h-[calc(100vh-14rem)]">
            <div className="space-y-1">
              {conversations.map((conv) => {
                const isSelected = selectedConversation === conv.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors',
                      isSelected ? 'bg-[#0A3AFF] text-white' : 'hover:bg-gray-100',
                    )}
                  >
                    <div className={cn(
                      'h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0',
                      isSelected ? 'bg-white/20' : 'bg-[#0A3AFF] text-white',
                    )}>
                      {getClientName(conv.client_id).charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {getClientName(conv.client_id)}
                      </p>
                      <p className={cn(
                        'text-xs truncate',
                        isSelected ? 'text-white/70' : 'text-gray-500',
                      )}>
                        {conv.last_message_at
                          ? formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: true })
                          : 'No messages'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>

      <div className={cn(
        'flex-1 flex flex-col',
        !selectedConversation && 'hidden md:flex',
      )}>
        {selectedConversation ? (
          <>
            <div className="flex items-center gap-3 p-3 border-b border-gray-200 bg-white rounded-t-lg">
              <button
                className="md:hidden"
                onClick={() => setSelectedConversation(null)}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="h-8 w-8 rounded-full bg-[#0A3AFF] text-white flex items-center justify-center text-sm font-bold">
                {getClientName(
                  conversations.find((c) => c.id === selectedConversation)?.client_id ?? ''
                ).charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-sm">
                  {getClientName(
                    conversations.find((c) => c.id === selectedConversation)?.client_id ?? ''
                  )}
                </p>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              {loadingMessages ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0A3AFF]" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <MessageSquare className="h-8 w-8 mb-2" />
                  <p className="text-sm">Start the conversation</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => {
                    const isOwn = msg.sender_id === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}
                      >
                        <div
                          className={cn(
                            'max-w-[70%] rounded-2xl px-4 py-2.5 text-sm',
                            isOwn
                              ? 'bg-[#0A3AFF] text-white rounded-br-md'
                              : 'bg-gray-100 text-gray-900 rounded-bl-md',
                          )}
                        >
                          <p>{msg.content}</p>
                          <p className={cn(
                            'text-[10px] mt-1',
                            isOwn ? 'text-white/60' : 'text-gray-400',
                          )}>
                            {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            <div className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-[#0A3AFF] hover:bg-blue-700"
                  disabled={!messageInput.trim() || sendMessageMutation.isPending}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-3" />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Conversation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-3">Select a client to message:</p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {clients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => {
                      const existing = conversations.find(
                        (c) => c.client_id === client.id
                      );
      if (existing) {
        setSelectedConversation(existing.id);
        setDialogOpen(false);
      } else {
        createConversationMutation.mutate(client.id);
      }
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-left"
                  >
                    <div className="h-8 w-8 rounded-full bg-[#0A3AFF] text-white flex items-center justify-center text-xs font-bold">
                      {client.user?.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{client.user?.name}</p>
                      <p className="text-xs text-gray-500">{client.user?.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}