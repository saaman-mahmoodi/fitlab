'use client';

import { useQuery } from '@tanstack/react-query';
import { subscriptionsApi } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SubscriptionPlanInfo } from '@/types';

const planFeatures: Record<string, string[]> = {
  starter: ['Up to 5 clients', 'Basic workout builder', 'Progress tracking', 'Email support'],
  growth: ['Up to 25 clients', 'Advanced workout builder', 'AI coaching tools', 'Messaging', 'Priority support'],
  pro: ['Up to 100 clients', 'All Growth features', 'Custom automations', 'Nutrition planning', 'Custom forms', 'API access'],
  elite: ['Unlimited clients', 'All Pro features', 'White-label branding', 'Dedicated support', 'Custom integrations', 'SLA guarantee'],
};

export default function BillingPage() {
  const { data: plans } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: () => subscriptionsApi.getPlans(),
  });

  const { data: subscription } = useQuery({
    queryKey: ['my-subscription'],
    queryFn: () => subscriptionsApi.getMySubscription(),
  });

  const plansList = (Array.isArray(plans) ? plans : []) as SubscriptionPlanInfo[];
  const currentPlan = (subscription as Record<string, unknown> | null)?.plan as string ?? null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="text-gray-500">Manage your subscription plan</p>
      </div>

      {currentPlan && (
        <Card className="mb-8 border-[#0A3AFF]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Current Plan</p>
                <p className="text-2xl font-bold text-[#0A3AFF] capitalize">{currentPlan}</p>
              </div>
              <Badge className="bg-green-100 text-green-700">Active</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plansList.map((plan) => {
          const isCurrent = currentPlan === plan.plan;
          const features = planFeatures[plan.plan] ?? [];
          return (
            <Card key={plan.plan} className={cn('relative', isCurrent && 'border-[#0A3AFF] ring-2 ring-[#0A3AFF]/20')}>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold capitalize mb-1">{plan.plan}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-gray-500">/mo</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={cn('w-full', isCurrent ? 'bg-gray-200 text-gray-500' : 'bg-[#0A3AFF] hover:bg-blue-700')}
                  disabled={isCurrent}
                >
                  {isCurrent ? 'Current Plan' : 'Upgrade'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}