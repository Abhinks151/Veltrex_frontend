import { Bell, X, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export type NotificationItem = {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

type NotificationBellProps = {
  initialNotifications: NotificationItem[];
};

const NotificationBell = ({ initialNotifications }: NotificationBellProps) => {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);
  const [notifOpen, setNotifOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'unread' | 'all'>('unread');
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const displayed =
    activeTab === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markOneRead(id: number) {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [notifOpen]);

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell trigger button */}
      <button
        onClick={() => setNotifOpen((prev) => !prev)}
        className="relative p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-orange-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification panel */}
      {notifOpen && (
        <div className="absolute right-0 top-10 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          {/* Panel header */}
          <div className="flex items-center gap-3 px-4 pt-4 pb-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">
                Notifications
              </p>
              <p className="text-xs text-gray-400">
                {unreadCount === 0
                  ? 'No unread notifications'
                  : `${unreadCount} unread`}
              </p>
            </div>
            <button
              onClick={() => setNotifOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close notifications"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 px-4 pb-3">
            <button
              onClick={() => setActiveTab('unread')}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                activeTab === 'unread'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              Unread
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeTab === 'unread'
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {unreadCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                activeTab === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              All
            </button>

            <button
              onClick={markAllRead}
              title="Mark all as read"
              className="ml-auto text-gray-300 hover:text-indigo-500 transition-colors"
              aria-label="Mark all as read"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>

          <div className="h-px bg-gray-100 mx-4" />

          {/* Notification list */}
          <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
            {displayed.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-8">
                No notifications
              </p>
            ) : (
              displayed.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markOneRead(n.id)}
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                    !n.read ? 'bg-indigo-50/30' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-gray-800">
                      {n.title}
                    </p>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0">
                      {n.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    {n.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
