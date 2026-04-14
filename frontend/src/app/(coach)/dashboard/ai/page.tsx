'use client';

import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiApi } from '@/lib/api/ai';
import { clientApi } from '@/lib/api/resources';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Dumbbell, TrendingUp, MessageSquare, Send, Loader2, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Client } from '@/types';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function AiToolsPage() {
  const queryClient = useQueryClient();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [workoutForm, setWorkoutForm] = useState({
    client_id: '',
    goals: '',
    preferences: '',
    duration_minutes: 60,
    difficulty: 'intermediate',
  });
  const [summaryForm, setSummaryForm] = useState({
    client_id: '',
    period: 'last_30_days',
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');

  const { data: clientsData } = useQuery({
    queryKey: ['clients-for-ai'],
    queryFn: () => clientApi.list(1, 100),
  });

  const clients = (clientsData?.data?.items ?? []) as Client[];

  const generateWorkoutMutation = useMutation({
    mutationFn: (data: typeof workoutForm) => aiApi.generateWorkout(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
    },
  });

  const progressSummaryMutation = useMutation({
    mutationFn: (data: typeof summaryForm) => aiApi.progressSummary(data),
  });

  const chatMutation = useMutation({
    mutationFn: (message: string) => aiApi.chat(message),
    onSuccess: (response) => {
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.data?.response || 'No response' },
      ]);
    },
    onError: () => {
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
    },
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, { role: 'user', content: chatInput.trim() }]);
    chatMutation.mutate(chatInput.trim());
    setChatInput('');
  };

  const difficultyOptions = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  const periodOptions = [
    { value: 'last_7_days', label: 'Last 7 days' },
    { value: 'last_30_days', label: 'Last 30 days' },
    { value: 'last_90_days', label: 'Last 90 days' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AI Tools</h1>
        <p className="text-gray-500">Leverage AI to enhance your coaching</p>
      </div>

      <Tabs defaultValue="workout">
        <TabsList className="mb-6">
          <TabsTrigger value="workout" className="gap-2">
            <Dumbbell className="h-4 w-4" />
            Workout Generator
          </TabsTrigger>
          <TabsTrigger value="summary" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Progress Summary
          </TabsTrigger>
          <TabsTrigger value="chat" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            AI Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workout">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#0A3AFF]" />
                  Generate Workout
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="client-select">Client</Label>
                  <select
                    id="client-select"
                    value={workoutForm.client_id}
                    onChange={(e) => setWorkoutForm({ ...workoutForm, client_id: e.target.value })}
                    className="w-full mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="">Select a client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.user?.name || 'Unknown'}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="goals">Goals</Label>
                  <Textarea
                    id="goals"
                    value={workoutForm.goals}
                    onChange={(e) => setWorkoutForm({ ...workoutForm, goals: e.target.value })}
                    placeholder="e.g., Build muscle, improve endurance, rehab knee..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="preferences">Preferences (optional)</Label>
                  <Textarea
                    id="preferences"
                    value={workoutForm.preferences}
                    onChange={(e) => setWorkoutForm({ ...workoutForm, preferences: e.target.value })}
                    placeholder="e.g., Prefers free weights, avoids overhead press..."
                    className="mt-1"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Duration (min)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={workoutForm.duration_minutes}
                      onChange={(e) => setWorkoutForm({ ...workoutForm, duration_minutes: parseInt(e.target.value) || 60 })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <select
                      id="difficulty"
                      value={workoutForm.difficulty}
                      onChange={(e) => setWorkoutForm({ ...workoutForm, difficulty: e.target.value })}
                      className="w-full mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
                    >
                      {difficultyOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button
                  className="w-full bg-[#0A3AFF] hover:bg-blue-700"
                  disabled={!workoutForm.client_id || !workoutForm.goals || generateWorkoutMutation.isPending}
                  onClick={() => generateWorkoutMutation.mutate(workoutForm)}
                >
                  {generateWorkoutMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Workout
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Result</CardTitle>
              </CardHeader>
              <CardContent>
                {generateWorkoutMutation.isError ? (
                  <p className="text-sm text-red-500">
                    {(generateWorkoutMutation.error as Error).message || 'Failed to generate workout'}
                  </p>
                ) : generateWorkoutMutation.data ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-base">
                        {generateWorkoutMutation.data.data?.workout?.title || 'Generated Workout'}
                      </h3>
                    </div>
                    {generateWorkoutMutation.data.data?.ai_suggestions && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">AI Suggestions:</p>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {generateWorkoutMutation.data.data.ai_suggestions.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {generateWorkoutMutation.data.data?.workout?.sets && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Workout Sets:</p>
                        <div className="space-y-2">
                          {generateWorkoutMutation.data.data.workout.sets.map((set, i) => (
                            <div key={set.id || i} className="text-sm bg-gray-50 rounded-lg p-3">
                              <span className="font-medium">{set.exercise?.name || 'Exercise'}</span>
                              <span className="text-gray-500 ml-2">
                                {set.sets}x{set.reps}{set.weight ? ` @ ${set.weight}lbs` : ''}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <Dumbbell className="h-10 w-10 mb-2" />
                    <p className="text-sm">Configure and generate a workout</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="summary">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#0A3AFF]" />
                  Progress Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="summary-client">Client</Label>
                  <select
                    id="summary-client"
                    value={summaryForm.client_id}
                    onChange={(e) => setSummaryForm({ ...summaryForm, client_id: e.target.value })}
                    className="w-full mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="">Select a client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.user?.name || 'Unknown'}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="period">Time Period</Label>
                  <select
                    id="period"
                    value={summaryForm.period}
                    onChange={(e) => setSummaryForm({ ...summaryForm, period: e.target.value })}
                    className="w-full mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
                  >
                    {periodOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <Button
                  className="w-full bg-[#0A3AFF] hover:bg-blue-700"
                  disabled={!summaryForm.client_id || progressSummaryMutation.isPending}
                  onClick={() => progressSummaryMutation.mutate(summaryForm)}
                >
                  {progressSummaryMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Generate Summary
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Result</CardTitle>
              </CardHeader>
              <CardContent>
                {progressSummaryMutation.isError ? (
                  <p className="text-sm text-red-500">
                    {(progressSummaryMutation.error as Error).message || 'Failed to generate summary'}
                  </p>
                ) : progressSummaryMutation.data ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Summary</p>
                      <p className="text-sm text-gray-600">
                        {progressSummaryMutation.data.data?.summary || 'No summary available'}
                      </p>
                    </div>
                    {progressSummaryMutation.data.data?.recommendations && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Recommendations</p>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {progressSummaryMutation.data.data.recommendations.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <TrendingUp className="h-10 w-10 mb-2" />
                    <p className="text-sm">Generate a client progress summary</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="chat">
          <Card className="flex flex-col h-[calc(100vh-16rem)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="h-5 w-5 text-[#0A3AFF]" />
                AI Coaching Assistant
              </CardTitle>
            </CardHeader>
            <Separator />
            <ScrollArea className="flex-1 p-4">
              {chatMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <Bot className="h-12 w-12 mb-3" />
                  <p className="font-medium mb-1">AI Coaching Assistant</p>
                  <p className="text-sm text-center max-w-sm">
                    Ask me about workout programming, exercise selection, client management, or any coaching question.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                    >
                      {msg.role === 'assistant' && (
                        <div className="h-8 w-8 rounded-full bg-[#0A3AFF] text-white flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4" />
                        </div>
                      )}
                      <div
                        className={cn(
                          'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm',
                          msg.role === 'user'
                            ? 'bg-[#0A3AFF] text-white rounded-br-md'
                            : 'bg-gray-100 text-gray-900 rounded-bl-md',
                        )}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      {msg.role === 'user' && (
                        <div className="h-8 w-8 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  ))}
                  {chatMutation.isPending && (
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#0A3AFF] text-white flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2.5">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              )}
            </ScrollArea>
            <Separator />
            <div className="p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleChatSend();
                }}
                className="flex gap-2"
              >
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask a coaching question..."
                  className="flex-1"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-[#0A3AFF] hover:bg-blue-700"
                  disabled={!chatInput.trim() || chatMutation.isPending}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}