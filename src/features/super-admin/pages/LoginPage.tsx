import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { loginUser } from '@/features/auth/authThunk';
import { notifyError, notifySuccess } from '@/shared/utils/toasterUtils';
import type { LoginRequest } from '@/features/auth/types';
import { useNavigate } from 'react-router-dom';
import SuperAdminLoginForm from '../components/SuperAdminLoginForm';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  async function handleLogin(data: LoginRequest) {
    try {
      await dispatch(loginUser(data)).unwrap();
      notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.LOGIN);
      navigate('/super-admin');
    } catch (err) {
      notifyError(err as string);
    }
  }

  const { loading, error } = useAppSelector((state) => state.auth);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <SuperAdminLoginForm
        onSubmit={handleLogin}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default LoginPage;
