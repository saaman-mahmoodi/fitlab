'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { automationsApi } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Zap, Plus, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'sonner';
import type { Automation, TriggerType, ActionType } from '@/types';

const triggerLabels: Record<TriggerType, string> = {
  missed_workouts: 'Missed Workouts',
  no_weight_change: 'No Weight Change',
  pr_logged: 'PR Logged',
  scheduled_time: 'Scheduled Time',
  client_milestone: 'Client Milestone',
};

const actionLabels: Record<ActionType, string> = {
  send_message: 'Send Message',
  send_email: 'Send Email',
  create_task: 'Create Task',
  update_client: 'Update Client',
};

export default function AutomationsPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    trigger: 'missed_workouts' as TriggerType,
    condition: { threshold: 3, days: 7 },
    action: 'send_message' as ActionType,
    action_config: { message: '' },
  });

  const { data: automations, isLoading } = useQuery({
    queryKey: ['automations'],
    queryFn: () => automationsApi.list(),
  });

  const createMutation = useMutation({
    mutationFn: automationsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations'] });
      setDialogOpen(false);
      setForm({ name: '', trigger: 'missed_workouts', condition: { threshold: 3, days: 7 }, action: 'send_message', action_config: { message: '' } });
      toast.success('Automation created');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to create automation'),
  });

  const deleteMutation = useMutation({
    mutationFn: automationsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations'] });
      toast.success('Automation deleted');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: automationsApi.toggle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations'] });
    },
  });

  const items: Automation[] = Array.isArray(automations) ? automations : [];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Automations</h1>
          <p className="text-gray-500">Automate repetitive coaching tasks</p>
        </div>
        <Button className="bg-[#0A3AFF] hover:bg-blue-700" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Automation
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A3AFF]" />
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Zap className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 mb-2">No automations yet</p>
            <p className="text-sm text-gray-400">Create your first automation to streamline your workflow</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((automation) => (
            <Card key={automation.id} className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium truncate">{automation.name}</h3>
                    <Badge variant={automation.is_active ? 'default' : 'secondary'}>
                      {automation.is_active ? 'Active' : 'Paused'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>When: {triggerLabels[automation.trigger]}</span>
                    <span>→</span>
                    <span>{actionLabels[automation.action]}</span>
                  </div>
                  {automation.execution_count > 0 && (
                    <p className="text-xs text-gray-400 mt-1">
                      Executed {automation.execution_count} times
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleMutation.mutate(automation.id)}
                  >
                    {automation.is_active ? (
                      <ToggleRight className="h-5 w-5 text-green-500" />
                    ) : (
                      <ToggleLeft className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => deleteMutation.mutate(automation.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Automation</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createMutation.mutate({
                name: form.name,
                trigger: form.trigger,
                condition: form.condition,
                action: form.action,
                action_config: form.action_config,
              });
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="trigger">Trigger</Label>
              <select
                id="trigger"
                value={form.trigger}
                onChange={(e) => setForm({ ...form, trigger: e.target.value as TriggerType })}
                className="w-full mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                {Object.entries(triggerLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="threshold">Threshold</Label>
                <Input id="threshold" type="number" value={form.condition.threshold} onChange={(e) => setForm({ ...form, condition: { ...form.condition, threshold: Number(e.target.value) } })} />
              </div>
              <div>
                <Label htmlFor="days">Days</Label>
                <Input id="days" type="number" value={form.condition.days} onChange={(e) => setForm({ ...form, condition: { ...form.condition, days: Number(e.target.value) } })} />
              </div>
            </div>
            <div>
              <Label htmlFor="action">Action</Label>
              <select
                id="action"
                value={form.action}
                onChange={(e) => setForm({ ...form, action: e.target.value as ActionType })}
                className="w-full mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                {Object.entries(actionLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            {form.action === 'send_message' && (
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" value={form.action_config.message} onChange={(e) => setForm({ ...form, action_config: { message: e.target.value } })} rows={3} />
              </div>
            )}
            <Button type="submit" className="w-full bg-[#0A3AFF] hover:bg-blue-700" disabled={createMutation.isPending}>
              {createMutation.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Creating...</> : 'Create Automation'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}