import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '@/features/auth/authThunk';
import { notifyError, notifySuccess } from '@/shared/utils/toasterUtils';
import { FRONTEND_MESSAGE_CONSTANTS } from '../../constants/messageConstants';
import { Bell, X, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

type Notification = {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    title: 'raw material low stock',
    message: "The raw material 'raw material' is low in stock.",
    time: '6 hours ago',
    read: false,
  },
  {
    id: 2,
    title: 'Production log',
    message: "New production log 'production log' is added.",
    time: '6 hours ago',
    read: false,
  },
  {
    id: 3,
    title: 'Production log',
    message: "The production log 'production log' is added.",
    time: '9 hours ago',
    read: false,
  },
  {
    id: 4,
    title: 'Production log',
    message: "The production log 'production log' is added.",
    time: '9 hours ago',
    read: true,
  },
  {
    id: 5,
    title: 'Production log',
    message: "The production log 'production log' is added.",
    time: '1 day ago',
    read: true,
  },
];

const PlatformNavbar = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [notifications, setNotifications] =
    useState<Notification[]>(DUMMY_NOTIFICATIONS);
  const [notifOpen, setNotifOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'unread' | 'all'>('all');
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const displayed =
    activeTab === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
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

  async function handleLogout() {
    try {
      await dispatch(logoutUser()).unwrap();
      notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.LOGOUT);
      navigate('/platform/login');
    } catch (error) {
      notifyError(
        (error as string) || FRONTEND_MESSAGE_CONSTANTS.ERROR.LOGOUT_FAILED,
      );
    }
  }

  return (
    <div className="w-full  h-14 border-b bg-white flex items-center justify-end px-6 gap-4 relative">
      {/* <div className="flex items-center gap-2 flex-1 max-w-xl bg-gray-50 border border-gray-200 rounded-md px-3 py-2"> */}
      {/* <Search className="w-4 h-4 text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Search production data, serials, or tasks..."
          className="bg-transparent text-sm text-gray-500 placeholder:text-gray-400 outline-none w-full"
        /> */}
      {/* </div> */}

      {/* <div></div> */}
      <div className="flex items-center  gap-4">
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setNotifOpen((prev) => !prev)}
            className="relative p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-orange-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-10 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
              <div className="flex items-center gap-3 px-4 pt-4 pb-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    Notification
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
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

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
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>

              <div className="h-px bg-gray-100 mx-4" />

              <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                {displayed.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-8">
                    No notifications
                  </p>
                ) : (
                  displayed.map((n) => (
                    <div
                      key={n.id}
                      onClick={() =>
                        setNotifications((prev) =>
                          prev.map((item) =>
                            item.id === n.id ? { ...item, read: true } : item,
                          ),
                        )
                      }
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

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-800 leading-tight">
                  {user?.name || 'User'}
                </p>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                  {user?.role || 'Supervisor'}
                </p>
              </div>
              <div className="w-9 h-9 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-semibold text-gray-600">
                    {user?.name?.[0] || 'U'}
                  </span>
                )}
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => navigate('/platform/profile')}>
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleLogout} className="text-red-500">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default PlatformNavbar;
