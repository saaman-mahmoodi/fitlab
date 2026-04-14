'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { exerciseApi } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Dumbbell } from 'lucide-react';

const categoryLabels: Record<string, string> = {
  chest: 'Chest',
  back: 'Back',
  shoulders: 'Shoulders',
  arms: 'Arms',
  legs: 'Legs',
  core: 'Core',
  cardio: 'Cardio',
  full_body: 'Full Body',
};

const categories = Object.keys(categoryLabels);

export default function ExercisesPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['exercises', page, search, selectedCategory],
    queryFn: () => exerciseApi.list(page, 50, search || undefined, selectedCategory),
  });

  const exercises = data?.data?.items ?? [];
  const totalPages = data?.data?.totalPages ?? 1;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Exercise Library</h1>
        <p className="text-gray-500">{data?.data?.total ?? 0} exercises available</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Badge
          variant={!selectedCategory ? 'default' : 'secondary'}
          className="cursor-pointer"
          onClick={() => { setSelectedCategory(undefined); setPage(1); }}
        >
          All
        </Badge>
        {categories.map((cat) => (
          <Badge
            key={cat}
            variant={selectedCategory === cat ? 'default' : 'secondary'}
            className="cursor-pointer"
            onClick={() => { setSelectedCategory(cat); setPage(1); }}
          >
            {categoryLabels[cat]}
          </Badge>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A3AFF]" />
        </div>
      ) : exercises.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Dumbbell className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500">No exercises found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercises.map((exercise) => (
            <Card key={exercise.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {categoryLabels[exercise.category] || exercise.category}
                  </Badge>
                </div>
                {exercise.equipment && (
                  <p className="text-sm text-gray-500 mb-2 capitalize">{exercise.equipment}</p>
                )}
                {exercise.muscle_groups && exercise.muscle_groups.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {exercise.muscle_groups.map((group) => (
                      <Badge key={group} variant="outline" className="text-xs capitalize">
                        {group}
                      </Badge>
                    ))}
                  </div>
                )}
                {exercise.instructions && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{exercise.instructions}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button
            className="px-4 py-2 text-sm border rounded-lg disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <button
            className="px-4 py-2 text-sm border rounded-lg disabled:opacity-50"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}