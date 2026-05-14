import { useAppDispatch } from "@/app/store/hooks";
import { logoutUser } from "@/features/auth/authThunk";
import { UserNavItems } from "@/shared/constants/constant";
import { notifyError, notifySuccess } from "@/shared/utils/toasterUtils";
import { LogOut, TerminalSquare } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FRONTEND_MESSAGE_CONSTANTS } from '../../../shared/constants/messageConstants';

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.LOGOUT);
      navigate("/platform/login");
    } catch (error) {
      notifyError((error as string) || FRONTEND_MESSAGE_CONSTANTS.ERROR.LOGOUT_FAILED);
    }
  };



  return (
    <div className="w-64 bg-[#f8f9fc] h-screen flex flex-col border-r border-gray-200">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-[#1e1b4b] p-2 rounded-lg">
          <TerminalSquare className="text-white w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-[#1e1b4b] text-lg leading-tight">
            User Console
          </span>
          <span className="text-[10px] text-gray-500 font-semibold tracking-wider">
            VELTREX
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {UserNavItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/platform' && location.pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                ? "bg-white text-[#4f46e5] shadow-sm"
                : "text-gray-600 hover:bg-gray-100/50 hover:text-gray-900"
                }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-[#4f46e5]" : "text-gray-400"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100/50 hover:text-gray-900 w-full transition-colors"
        >
          <LogOut className="w-5 h-5 text-gray-400" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
