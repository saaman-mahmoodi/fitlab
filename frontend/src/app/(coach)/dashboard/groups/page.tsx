'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupsApi, clientApi } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Loader2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import type { TrainingGroup, Client } from '@/types';

export default function GroupsPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [membersDialogOpen, setMembersDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<TrainingGroup | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [selectedClients, setSelectedClients] = useState<string[]>([]);

  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: () => groupsApi.list(),
  });

  const { data: clientsData } = useQuery({
    queryKey: ['clients-groups'],
    queryFn: () => clientApi.list(1, 100),
  });

  const createMutation = useMutation({
    mutationFn: groupsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setDialogOpen(false);
      setForm({ name: '', description: '' });
      toast.success('Group created');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to create group'),
  });

  const addMembersMutation = useMutation({
    mutationFn: ({ id, clientIds }: { id: string; clientIds: string[] }) => groupsApi.addMembers(id, clientIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setMembersDialogOpen(false);
      setSelectedClients([]);
      toast.success('Members added');
    },
  });

  const removeMutation = useMutation({
    mutationFn: groupsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast.success('Group deleted');
    },
  });

  const groupsList = (Array.isArray(groups) ? groups : []) as TrainingGroup[];
  const clients = (clientsData?.data?.items ?? []) as Client[];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Training Groups</h1>
          <p className="text-gray-500">Organize clients into training groups</p>
        </div>
        <Button className="bg-[#0A3AFF] hover:bg-blue-700" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />New Group
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A3AFF]" /></div>
      ) : groupsList.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 mb-2">No groups yet</p>
            <p className="text-sm text-gray-400">Create your first training group</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groupsList.map((group) => (
            <Card key={group.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{group.name}</h3>
                  <Badge variant={group.is_active ? 'default' : 'secondary'}>{group.is_active ? 'Active' : 'Inactive'}</Badge>
                </div>
                {group.description && <p className="text-sm text-gray-500 mb-3">{group.description}</p>}
                <p className="text-sm text-gray-400 mb-3">
                  {group.members?.length ?? 0} member{(group.members?.length ?? 0) !== 1 ? 's' : ''}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setSelectedGroup(group); setMembersDialogOpen(true); }}>
                    <UserPlus className="h-3.5 w-3.5 mr-1" />Members
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => removeMutation.mutate(group.id)}>
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
          <DialogHeader><DialogTitle>Create Training Group</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate({ name: form.name, description: form.description || undefined }); }} className="space-y-4">
            <div><Label htmlFor="group-name">Name</Label><Input id="group-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div><Label htmlFor="group-desc">Description</Label><Textarea id="group-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
            <Button type="submit" className="w-full bg-[#0A3AFF] hover:bg-blue-700" disabled={createMutation.isPending}>
              {createMutation.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Creating...</> : 'Create Group'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={membersDialogOpen} onOpenChange={setMembersDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Manage Members — {selectedGroup?.name}</DialogTitle></DialogHeader>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {clients.map((client: { id: string; user?: { name?: string } }) => {
              const isMember = selectedGroup?.members?.some((m: { id: string }) => m.id === client.id);
              const isSelected = selectedClients.includes(client.id);
              return (
                <label key={client.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isMember || isSelected}
                    disabled={isMember}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedClients([...selectedClients, client.id]);
                      } else {
                        setSelectedClients(selectedClients.filter((id) => id !== client.id));
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{client.user?.name || 'Unknown'}</span>
                </label>
              );
            })}
          </div>
          {selectedClients.length > 0 && (
            <Button className="w-full bg-[#0A3AFF] hover:bg-blue-700 mt-4" onClick={() => { if (selectedGroup) addMembersMutation.mutate({ id: selectedGroup.id, clientIds: selectedClients }); }}>
              Add {selectedClients.length} Member{selectedClients.length !== 1 ? 's' : ''}
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}