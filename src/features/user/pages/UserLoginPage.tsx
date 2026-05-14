import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { loginUser } from "@/features/auth/authThunk";
import { notifyError, notifySuccess } from "@/shared/utils/toasterUtils";
import type { LoginRequest } from "@/features/auth/types";
import { useNavigate } from "react-router-dom";
import UserLoginForm from "../components/UserLoginForm";
import { FRONTEND_MESSAGE_CONSTANTS } from '../../../shared/constants/messageConstants';

const UserLoginPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  async function handleLogin(data: LoginRequest) {
    try {
      await dispatch(loginUser(data)).unwrap()
      notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.LOGIN)
      navigate("/platform")
    } catch (err) {
      notifyError(err as string)
    }
  }

  const { loading, error } = useAppSelector((state) => state.auth)

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <UserLoginForm onSubmit={handleLogin} loading={loading} error={error} />
    </div>
  )
}

export default UserLoginPage