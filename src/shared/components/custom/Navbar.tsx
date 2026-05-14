import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "@/features/auth/authThunk";
import { notifyError, notifySuccess } from "@/shared/utils/toasterUtils";
import { FRONTEND_MESSAGE_CONSTANTS } from '../../constants/messageConstants';

const Navbar = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  async function handleLogout() {
    try {
      await dispatch(logoutUser()).unwrap();
      notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.LOGOUT);
      navigate("/auth/login");
    } catch (error) {
      notifyError((error as string) || FRONTEND_MESSAGE_CONSTANTS.ERROR.LOGOUT_FAILED);
    }
  }

  return (
    <div className="w-full h-14 border-b bg-white flex items-center justify-between px-6">
      <div className="flex items-center gap-6">
        <h1 className="font-semibold text-lg">Veltrex</h1>

        <div className="flex gap-4 text-sm text-gray-600">
          <Link to="/home" className="hover:text-black">
            Home
          </Link>
          <Link to="/pricing" className="hover:text-black">
            Pricing
          </Link>
          <Link to="/profile" className="hover:text-black">
            Profile
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white text-sm overflow-hidden">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.name?.[0] || "U"
              )}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => navigate("/settings")}>
              Settings
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-500"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};


export default Navbar;