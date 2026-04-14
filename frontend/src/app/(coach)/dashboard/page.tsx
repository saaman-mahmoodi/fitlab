'use client';

import { useAuthStore } from '@/stores/auth';
import { useQuery } from '@tanstack/react-query';
import { clientApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Dumbbell, Calendar, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data: clientsData } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientApi.list(),
  });

  const stats = [
    {
      title: 'Total Clients',
      value: clientsData?.data?.total ?? 0,
      icon: Users,
      href: '/dashboard/clients',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Active Workouts',
      value: '-',
      icon: Dumbbell,
      href: '/dashboard/workouts',
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'This Week',
      value: '-',
      icon: Calendar,
      href: '#',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Messages',
      value: '-',
      icon: MessageSquare,
      href: '#',
      color: 'bg-orange-50 text-orange-600',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0] || 'Coach'}
        </h1>
        <p className="text-gray-500 mt-1">Here&apos;s an overview of your coaching activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Clients</CardTitle>
          </CardHeader>
          <CardContent>
            {clientsData?.data?.items?.length ? (
              <div className="space-y-3">
                {clientsData.data.items.slice(0, 5).map((client) => (
                  <div key={client.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{client.user?.name || 'Unknown'}</p>
                      <p className="text-sm text-gray-500">{client.user?.email}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      client.status === 'active' ? 'bg-green-100 text-green-700' :
                      client.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {client.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No clients yet</p>
                <Link href="/dashboard/clients" className="text-[#0A3AFF] text-sm hover:underline">
                  Add your first client
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/dashboard/clients"
              className="block w-full p-3 rounded-lg border border-gray-200 hover:border-[#0A3AFF] hover:bg-blue-50 transition-colors"
            >
              <p className="font-medium">Add New Client</p>
              <p className="text-sm text-gray-500">Create a client profile and assign programs</p>
            </Link>
            <Link
              href="/dashboard/workouts"
              className="block w-full p-3 rounded-lg border border-gray-200 hover:border-[#0A3AFF] hover:bg-blue-50 transition-colors"
            >
              <p className="font-medium">Create Workout</p>
              <p className="text-sm text-gray-500">Build a new workout program for a client</p>
            </Link>
            <Link
              href="/dashboard/exercises"
              className="block w-full p-3 rounded-lg border border-gray-200 hover:border-[#0A3AFF] hover:bg-blue-50 transition-colors"
            >
              <p className="font-medium">Browse Exercises</p>
              <p className="text-sm text-gray-500">View and manage your exercise library</p>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}