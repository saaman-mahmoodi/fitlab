'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { AuthGuard } from '@/lib/auth-guard';
import { NotificationBell } from '@/components/notifications/notification-bell';

export default function CoachLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="lg:pl-64">
          <header className="sticky top-0 z-30 flex items-center justify-end px-4 lg:px-8 py-3 bg-white border-b border-gray-200 lg:pt-4">
            <NotificationBell />
          </header>
          <main className="p-4 lg:p-8 pt-4 lg:pt-8">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}