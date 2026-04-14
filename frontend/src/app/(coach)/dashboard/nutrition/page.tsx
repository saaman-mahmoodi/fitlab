'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { nutritionApi, clientApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Utensils, Plus, Loader2, Apple } from 'lucide-react';
import { toast } from 'sonner';
import type { MealPlan, FoodLog, MacroSummary } from '@/types';

const mealTypeLabels: Record<string, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};

export default function NutritionPage() {
  const queryClient = useQueryClient();
  const [selectedClient, setSelectedClient] = useState('');
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const [planForm, setPlanForm] = useState({ name: '', description: '', start_date: new Date().toISOString().split('T')[0], daily_calories_target: 2000, protein_g: 150, carbs_g: 250, fat_g: 70 });
  const [logForm, setLogForm] = useState({ date: new Date().toISOString().split('T')[0], meal_type: 'breakfast' as string, food_name: '', calories: '', protein_g: '', carbs_g: '', fat_g: '', serving_size: '', serving_unit: 'g' });

  const { data: clientsData } = useQuery({
    queryKey: ['clients-nutrition'],
    queryFn: () => clientApi.list(1, 100),
  });
  const clients = (clientsData?.data?.items ?? []);

  const { data: mealPlans, isLoading: loadingPlans } = useQuery({
    queryKey: ['meal-plans', selectedClient],
    queryFn: () => nutritionApi.getMealPlans(selectedClient),
    enabled: !!selectedClient,
  });

  const { data: macroSummary } = useQuery({
    queryKey: ['macro-summary', selectedClient],
    queryFn: () => nutritionApi.getMacroSummary(selectedClient),
    enabled: !!selectedClient,
  });

  const createPlanMutation = useMutation({
    mutationFn: nutritionApi.createMealPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meal-plans', selectedClient] });
      setPlanDialogOpen(false);
      toast.success('Meal plan created');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to create plan'),
  });

  const createLogMutation = useMutation({
    mutationFn: nutritionApi.createFoodLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['macro-summary', selectedClient] });
      setLogDialogOpen(false);
      setLogForm({ date: logForm.date, meal_type: logForm.meal_type, food_name: '', calories: '', protein_g: '', carbs_g: '', fat_g: '', serving_size: '', serving_unit: 'g' });
      toast.success('Food logged');
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to log food'),
  });

  const summary = macroSummary as unknown as MacroSummary | undefined;
  const plans = (Array.isArray(mealPlans) ? mealPlans : []) as MealPlan[];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nutrition</h1>
          <p className="text-gray-500">Manage meal plans and track macros</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-[#0A3AFF] hover:bg-blue-700" onClick={() => setPlanDialogOpen(true)} disabled={!selectedClient}>
            <Plus className="h-4 w-4 mr-2" />Meal Plan
          </Button>
          <Button variant="outline" onClick={() => setLogDialogOpen(true)} disabled={!selectedClient}>
            <Apple className="h-4 w-4 mr-2" />Log Food
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          className="w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Select a client...</option>
          {clients.map((client: { id: string; user?: { name?: string } }) => (
            <option key={client.id} value={client.id}>{client.user?.name || 'Unknown'}</option>
          ))}
        </select>
      </div>

      {!selectedClient ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Utensils className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500">Select a client to view nutrition data</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader><CardTitle className="text-lg">Today&apos;s Macros</CardTitle></CardHeader>
              <CardContent>
                {summary ? (
                  <div className="space-y-3">
                    <div className="flex justify-between"><span className="text-gray-600">Calories</span><span className="font-semibold">{summary.total_calories} kcal</span></div>
                    <Separator />
                    <div className="flex justify-between"><span className="text-gray-600">Protein</span><span className="font-semibold text-blue-600">{summary.total_protein_g}g</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Carbs</span><span className="font-semibold text-amber-600">{summary.total_carbs_g}g</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Fat</span><span className="font-semibold text-red-600">{summary.total_fat_g}g</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Fiber</span><span className="font-semibold text-green-600">{summary.total_fiber_g}g</span></div>
                    <Separator />
                    {summary.meals.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Today&apos;s Meals</p>
                        {summary.meals.map((meal: FoodLog) => (
                          <div key={meal.id} className="flex items-center justify-between py-1 text-sm">
                            <div>
                              <Badge variant="secondary" className="text-xs mr-2">{mealTypeLabels[meal.meal_type] || meal.meal_type}</Badge>
                              <span>{meal.food_name}</span>
                            </div>
                            <span className="text-gray-500">{meal.calories} kcal</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">No data today</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader><CardTitle className="text-lg">Meal Plans</CardTitle></CardHeader>
              <CardContent>
                {loadingPlans ? (
                  <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0A3AFF]" /></div>
                ) : plans.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">No meal plans yet</p>
                ) : (
                  <div className="space-y-3">
                    {plans.map((plan) => (
                      <div key={plan.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{plan.name}</h4>
                          <Badge variant={plan.is_active ? 'default' : 'secondary'}>{plan.is_active ? 'Active' : 'Inactive'}</Badge>
                        </div>
                        {plan.description && <p className="text-sm text-gray-500 mb-1">{plan.description}</p>}
                        <div className="flex gap-4 text-xs text-gray-400">
                          <span>{plan.daily_calories_target || '—'} kcal/day</span>
                          {plan.macro_targets && (
                            <>
                              <span>P: {plan.macro_targets.protein_g || '—'}g</span>
                              <span>C: {plan.macro_targets.carbs_g || '—'}g</span>
                              <span>F: {plan.macro_targets.fat_g || '—'}g</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Meal Plan</DialogTitle></DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            createPlanMutation.mutate({
              client_id: selectedClient,
              name: planForm.name,
              description: planForm.description || undefined,
              start_date: planForm.start_date,
              daily_calories_target: planForm.daily_calories_target || undefined,
              macro_targets: { protein_g: planForm.protein_g || undefined, carbs_g: planForm.carbs_g || undefined, fat_g: planForm.fat_g || undefined },
            });
          }} className="space-y-4">
            <div><Label htmlFor="plan-name">Name</Label><Input id="plan-name" value={planForm.name} onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })} required /></div>
            <div><Label htmlFor="plan-desc">Description</Label><Textarea id="plan-desc" value={planForm.description} onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })} rows={2} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label htmlFor="plan-date">Start Date</Label><Input id="plan-date" type="date" value={planForm.start_date} onChange={(e) => setPlanForm({ ...planForm, start_date: e.target.value })} required /></div>
              <div><Label htmlFor="plan-cal">Daily Calories</Label><Input id="plan-cal" type="number" value={planForm.daily_calories_target} onChange={(e) => setPlanForm({ ...planForm, daily_calories_target: Number(e.target.value) })} /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label htmlFor="plan-protein">Protein (g)</Label><Input id="plan-protein" type="number" value={planForm.protein_g} onChange={(e) => setPlanForm({ ...planForm, protein_g: Number(e.target.value) })} /></div>
              <div><Label htmlFor="plan-carbs">Carbs (g)</Label><Input id="plan-carbs" type="number" value={planForm.carbs_g} onChange={(e) => setPlanForm({ ...planForm, carbs_g: Number(e.target.value) })} /></div>
              <div><Label htmlFor="plan-fat">Fat (g)</Label><Input id="plan-fat" type="number" value={planForm.fat_g} onChange={(e) => setPlanForm({ ...planForm, fat_g: Number(e.target.value) })} /></div>
            </div>
            <Button type="submit" className="w-full bg-[#0A3AFF] hover:bg-blue-700" disabled={createPlanMutation.isPending}>
              {createPlanMutation.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Creating...</> : 'Create Plan'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={logDialogOpen} onOpenChange={setLogDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Log Food</DialogTitle></DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            createLogMutation.mutate({
              client_id: selectedClient,
              date: logForm.date,
              meal_type: logForm.meal_type,
              food_name: logForm.food_name,
              calories: logForm.calories ? Number(logForm.calories) : undefined,
              protein_g: logForm.protein_g ? Number(logForm.protein_g) : undefined,
              carbs_g: logForm.carbs_g ? Number(logForm.carbs_g) : undefined,
              fat_g: logForm.fat_g ? Number(logForm.fat_g) : undefined,
              serving_size: logForm.serving_size ? Number(logForm.serving_size) : undefined,
              serving_unit: logForm.serving_unit || undefined,
            });
          }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label htmlFor="log-date">Date</Label><Input id="log-date" type="date" value={logForm.date} onChange={(e) => setLogForm({ ...logForm, date: e.target.value })} required /></div>
              <div><Label htmlFor="log-meal">Meal</Label>
                <select id="log-meal" value={logForm.meal_type} onChange={(e) => setLogForm({ ...logForm, meal_type: e.target.value })} className="w-full mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm">
                  {Object.entries(mealTypeLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            </div>
            <div><Label htmlFor="log-food">Food Name</Label><Input id="log-food" value={logForm.food_name} onChange={(e) => setLogForm({ ...logForm, food_name: e.target.value })} required /></div>
            <div className="grid grid-cols-4 gap-3">
              <div><Label htmlFor="log-cal">Calories</Label><Input id="log-cal" type="number" value={logForm.calories} onChange={(e) => setLogForm({ ...logForm, calories: e.target.value })} /></div>
              <div><Label htmlFor="log-protein">Protein (g)</Label><Input id="log-protein" type="number" value={logForm.protein_g} onChange={(e) => setLogForm({ ...logForm, protein_g: e.target.value })} /></div>
              <div><Label htmlFor="log-carbs">Carbs (g)</Label><Input id="log-carbs" type="number" value={logForm.carbs_g} onChange={(e) => setLogForm({ ...logForm, carbs_g: e.target.value })} /></div>
              <div><Label htmlFor="log-fat">Fat (g)</Label><Input id="log-fat" type="number" value={logForm.fat_g} onChange={(e) => setLogForm({ ...logForm, fat_g: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label htmlFor="log-serving">Serving Size</Label><Input id="log-serving" type="number" value={logForm.serving_size} onChange={(e) => setLogForm({ ...logForm, serving_size: e.target.value })} /></div>
              <div><Label htmlFor="log-unit">Unit</Label><Input id="log-unit" value={logForm.serving_unit} onChange={(e) => setLogForm({ ...logForm, serving_unit: e.target.value })} /></div>
            </div>
            <Button type="submit" className="w-full bg-[#0A3AFF] hover:bg-blue-700" disabled={createLogMutation.isPending}>
              {createLogMutation.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Logging...</> : 'Log Food'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}