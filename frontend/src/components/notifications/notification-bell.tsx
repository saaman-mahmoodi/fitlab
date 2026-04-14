'use client';

import { useEffect, useRef, useState } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useNotificationsStore } from '@/stores/notifications';
import { useSocket } from '@/hooks/use-socket';
import { useAuthStore } from '@/stores/auth';
import type { Notification } from '@/types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { token } = useAuthStore();
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    fetchUnreadCount,
    markRead,
    markAllRead,
    addNotification,
  } = useNotificationsStore();
  const { on } = useSocket();

  useEffect(() => {
    if (token) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [token, fetchNotifications, fetchUnreadCount]);

  useEffect(() => {
    if (!token) return;
    const cleanup = on('notification', (data: unknown) => {
      addNotification(data as Notification);
    });
    return cleanup;
  }, [token, on, addNotification]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const typeIcon = (type: string) => {
    switch (type) {
      case 'workout_assigned': return '🏋️';
      case 'workout_completed': return '✅';
      case 'message_received': return '💬';
      case 'progress_update': return '📈';
      case 'reminder': return '⏰';
      default: return '🔔';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setOpen(!open)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <h3 className="font-semibold text-sm">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-[#0A3AFF] hover:underline"
                >
                  Mark all read
                </button>
              )}
              <button onClick={() => setOpen(false)}>
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
          <ScrollArea className="max-h-96">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification, i) => (
                <div key={notification.id}>
                  {i > 0 && <Separator />}
                  <div
                    className={cn(
                      'flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-50',
                      !notification.read && 'bg-blue-50/50',
                    )}
                    onClick={() => {
                      if (!notification.read) markRead(notification.id);
                    }}
                  >
                    <span className="text-lg mt-0.5">{typeIcon(notification.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-sm', !notification.read && 'font-semibold')}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    {!notification.read && (
                      <Check className="h-3.5 w-3.5 text-gray-400 flex-shrink-0 mt-1" />
                    )}
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}