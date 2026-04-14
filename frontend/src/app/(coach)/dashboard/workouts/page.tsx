'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientApi, workoutApi } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Plus, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function WorkoutsPage() {
  const [selectedClient, setSelectedClient] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const queryClient = useQueryClient();

  const { data: clientsData } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientApi.list(1, 100),
  });

  const { data: workoutsData, isLoading } = useQuery({
    queryKey: ['workouts', selectedClient],
    queryFn: () => workoutApi.list(selectedClient || ''),
    enabled: !!selectedClient,
  });

  const createMutation = useMutation({
    mutationFn: (data: { client_id: string; title: string; date: string }) =>
      workoutApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      setDialogOpen(false);
      setTitle('');
      toast.success('Workout created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create workout');
    },
  });

  const clients = clientsData?.data?.items ?? [];
  const workouts = workoutsData?.data?.items ?? [];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workouts</h1>
          <p className="text-gray-500">Create and manage workout programs</p>
        </div>
        <Button className="bg-[#0A3AFF] hover:bg-blue-700" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Workout
        </Button>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Workout</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!selectedClient) {
                  toast.error('Please select a client first');
                  return;
                }
                createMutation.mutate({ client_id: selectedClient, title, date });
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="client">Client</Label>
                <select
                  id="client"
                  className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm"
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                >
                  <option value="">Select a client...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.user?.name || c.id}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="title">Workout Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Upper Body Push"
                  required
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#0A3AFF] hover:bg-blue-700"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? 'Creating...' : 'Create Workout'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!selectedClient && clients.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <Label>Select a client to view their workouts</Label>
            <select
              className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm mt-2"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
            >
              <option value="">Select a client...</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.user?.name || c.id}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>
      )}

      {selectedClient && isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A3AFF]" />
        </div>
      ) : selectedClient && workouts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Dumbbell className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500">No workouts yet for this client</p>
            <p className="text-sm text-gray-400">Create their first workout above</p>
          </CardContent>
        </Card>
      ) : selectedClient ? (
        <div className="space-y-4">
          {workouts.map((workout) => (
            <Card key={workout.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-[#0A3AFF]" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{workout.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(workout.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {workout.generated_by_ai && (
                      <Badge className="bg-purple-100 text-purple-700">AI</Badge>
                    )}
                    <Badge variant={workout.completed ? 'default' : 'secondary'}>
                      {workout.completed ? 'Completed' : 'Pending'}
                    </Badge>
                    {workout.sets && (
                      <span className="text-sm text-gray-500">
                        {workout.sets.length} exercises
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}