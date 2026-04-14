'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formsApi } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Plus, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import type { Form, FormStatus } from '@/types';

const statusColors: Record<FormStatus, string> = {
  draft: 'secondary',
  published: 'default',
  closed: 'destructive',
};

export default function FormsPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '' });
  const [fields, setFields] = useState([{ id: '1', type: 'text' as const, label: '', required: false }]);

  const { data: forms, isLoading } = useQuery({
    queryKey: ['forms'],
    queryFn: () => formsApi.list(),
  });

  const createMutation = useMutation({
    mutationFn: formsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      setDialogOpen(false);
      setForm({ title: '', description: '' });
      setFields([{ id: '1', type: 'text', label: '', required: false }]);
      toast.success('Form created');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to create form'),
  });

  const publishMutation = useMutation({
    mutationFn: formsApi.publish,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['forms'] }); toast.success('Form published'); },
  });

  const closeMutation = useMutation({
    mutationFn: formsApi.close,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['forms'] }); toast.success('Form closed'); },
  });

  const deleteMutation = useMutation({
    mutationFn: formsApi.delete,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['forms'] }); toast.success('Form deleted'); },
  });

  const formsList = (Array.isArray(forms) ? forms : []) as Form[];

  const addField = () => {
    setFields([...fields, { id: String(Date.now()), type: 'text', label: '', required: false }]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const updateField = (id: string, key: string, value: string | boolean) => {
    setFields(fields.map((f) => f.id === id ? { ...f, [key]: value } : f));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Forms & Questionnaires</h1>
          <p className="text-gray-500">Create custom forms for intake and assessments</p>
        </div>
        <Button className="bg-[#0A3AFF] hover:bg-blue-700" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />New Form
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A3AFF]" /></div>
      ) : formsList.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ClipboardList className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 mb-2">No forms yet</p>
            <p className="text-sm text-gray-400">Create intake forms, assessments, and questionnaires</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {formsList.map((f) => (
            <Card key={f.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold truncate">{f.title}</h3>
                  <Badge variant={statusColors[f.status] as 'default' | 'secondary' | 'destructive'}>{f.status}</Badge>
                </div>
                {f.description && <p className="text-sm text-gray-500 mb-2 line-clamp-2">{f.description}</p>}
                <p className="text-xs text-gray-400 mb-3">{f.fields?.length ?? 0} fields</p>
                <div className="flex gap-2">
                  {f.status === 'draft' && (
                    <Button size="sm" variant="outline" onClick={() => publishMutation.mutate(f.id)}>
                      <Send className="h-3.5 w-3.5 mr-1" />Publish
                    </Button>
                  )}
                  {f.status === 'published' && (
                    <Button size="sm" variant="outline" onClick={() => closeMutation.mutate(f.id)}>
                      Close
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => deleteMutation.mutate(f.id)}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Create Form</DialogTitle></DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate({
              title: form.title,
              description: form.description || undefined,
              fields: fields.map((f) => ({ ...f, required: f.required ?? false })),
            });
          }} className="space-y-4">
            <div><Label htmlFor="form-title">Title</Label><Input id="form-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
            <div><Label htmlFor="form-desc">Description</Label><Textarea id="form-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} /></div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Fields</Label>
                <Button type="button" size="sm" variant="outline" onClick={addField}>+ Add Field</Button>
              </div>
              <div className="space-y-3">
                {fields.map((field, i) => (
                  <div key={field.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Field {i + 1}</span>
                      {fields.length > 1 && (
                        <button type="button" className="text-xs text-red-500 hover:text-red-700" onClick={() => removeField(field.id)}>Remove</button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Label" value={field.label} onChange={(e) => updateField(field.id, 'label', e.target.value)} />
                      <select value={field.type} onChange={(e) => updateField(field.id, 'type', e.target.value)} className="rounded-md border border-gray-300 px-3 py-2 text-sm">
                        <option value="text">Text</option>
                        <option value="textarea">Long Text</option>
                        <option value="number">Number</option>
                        <option value="select">Dropdown</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="scale">Scale (1–10)</option>
                        <option value="date">Date</option>
                      </select>
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={field.required ?? false} onChange={(e) => updateField(field.id, 'required', e.target.checked)} className="rounded" />
                      Required
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full bg-[#0A3AFF] hover:bg-blue-700" disabled={createMutation.isPending}>
              {createMutation.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Creating...</> : 'Create Form'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}