'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';

const publicRoutes = ['/', '/login', '/signup', '/pricing', '/about'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loadUser, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const isPublicRoute = publicRoutes.some((route) => pathname === route);

    if (!isAuthenticated && !isPublicRoute && !pathname.startsWith('/login') && !pathname.startsWith('/signup')) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A3AFF]" />
      </div>
    );
  }

  return <>{children}</>;
}