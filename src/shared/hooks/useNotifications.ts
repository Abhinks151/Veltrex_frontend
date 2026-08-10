import { useEffect, useState } from 'react';
import { useAppSelector } from '@/app/store/hooks';
import { notificationService } from '@/services/notificationService';
import { axiosInstance } from '@/app/api/axios';

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

const formatTimeAgo = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 0) return 'Just now';
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    return `${diffDays}d ago`;
  } catch {
    return 'Just now';
  }
};

export const useNotifications = () => {
  const { token, isAuthenticated } = useAppSelector((state) => state.auth);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const fetchList = async () => {
    try {
      const response = await notificationService.list();
      if (response.data.success && response.data.data) {
        const mapped = response.data.data.map((item) => ({
          id: item.id,
          title: item.title,
          message: item.message,
          read: item.readAt !== null,
          time: formatTimeAgo(item.createdAt),
        }));
        setNotifications(mapped);
      }
    } catch (error) {
      console.error('Failed to fetch notifications on load:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchList();
    } else {
      setNotifications([]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const sseUrl = `${axiosInstance.defaults.baseURL}/notifications/sse?token=${token}`;
    const eventSource = new EventSource(sseUrl, { withCredentials: true });

    eventSource.onmessage = (event) => {
      try {
        const raw = JSON.parse(event.data);
        const mapped: NotificationItem = {
          id: raw.id,
          title: raw.title,
          message: raw.message,
          read: raw.read === true,
          time: 'Just now',
        };
        setNotifications((prev) => [mapped, ...prev]);
      } catch (err) {
        console.error('Failed to parse incoming SSE message:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.warn(
        'SSE notification stream closed or disconnected. Reconnecting...',
        err,
      );
    };

    return () => {
      eventSource.close();
    };
  }, [token, isAuthenticated]);

  const markOneRead = async (id: string) => {
    try {
      await notificationService.markRead(id);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif,
        ),
      );
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true })),
      );
    } catch (err) {
      console.error('Failed to mark all notifications read:', err);
    }
  };

  return {
    notifications,
    markOneRead,
    markAllRead,
  };
};
