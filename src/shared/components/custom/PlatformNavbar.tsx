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
import NotificationBell, { type NotificationItem } from './NotificationBell';

const DUMMY_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    title: 'Raw material low stock',
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
      <div className="flex items-center gap-4">
        <NotificationBell initialNotifications={DUMMY_NOTIFICATIONS} />

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
