'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'coach' | 'client'>('coach');
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password, role);
      toast.success('Account created!');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/">
            <span className="text-3xl font-bold text-[#0A3AFF]">FitLab</span>
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-gray-900">Start your free trial</h1>
          <p className="mt-2 text-gray-600">No credit card required. Cancel anytime.</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
              </div>

              <div>
                <Label>I am a...</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setRole('coach')}
                    className={`px-4 py-3 border-2 rounded-lg text-sm font-medium transition ${
                      role === 'coach'
                        ? 'border-[#0A3AFF] text-[#0A3AFF] bg-blue-50'
                        : 'border-gray-300 text-gray-700 hover:border-[#0A3AFF]'
                    }`}
                  >
                    Coach
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('client')}
                    className={`px-4 py-3 border-2 rounded-lg text-sm font-medium transition ${
                      role === 'client'
                        ? 'border-[#0A3AFF] text-[#0A3AFF] bg-blue-50'
                        : 'border-gray-300 text-gray-700 hover:border-[#0A3AFF]'
                    }`}
                  >
                    Client
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#0A3AFF] hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-[#0A3AFF] hover:text-blue-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}