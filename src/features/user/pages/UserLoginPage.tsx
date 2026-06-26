import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { loginUser } from '@/features/auth/authThunk';
import { notifyError, notifySuccess } from '@/shared/utils/toasterUtils';
import type { LoginRequest } from '@/features/auth/types';
import { useNavigate } from 'react-router-dom';
import UserLoginForm from '../components/UserLoginForm';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';
import { getSubdomain, getSubdomainUrl } from '@/shared/utils/subdomain';

const UserLoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  async function handleLogin(data: LoginRequest) {
    try {
      const result = await dispatch(loginUser(data)).unwrap();
      console.log('Login result:', result);

      notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.LOGIN);

      const user = result.data?.user;
      const subdomain = user?.subdomain;
      const currentSubdomain = getSubdomain();

      console.log('User Subdomain:', subdomain);
      console.log('Current Subdomain:', currentSubdomain);

      if (subdomain) {
        if (currentSubdomain === subdomain) {
          console.log('Same subdomain, navigating to /platform');
          navigate('/platform');
        } else {
          const redirectUrl = getSubdomainUrl(subdomain, '/platform');
          console.log('Redirecting to subdomain URL:', redirectUrl);
          window.location.assign(redirectUrl);
        }
      } else {
        console.log('No subdomain, navigating to /platform');
        navigate('/platform');
      }
    } catch (err) {
      console.error('Login Error:', err);
      notifyError(err as string);
    }
  }

  const { user, isAuthenticated, loading, error } = useAppSelector(
    (state) => state.auth,
  );
  useEffect(() => {
    if (isAuthenticated && user?.subdomain) {
      const currentSubdomain = getSubdomain();
      if (currentSubdomain !== user.subdomain) {
        window.location.assign(getSubdomainUrl(user.subdomain, '/platform'));
      } else {
        navigate('/platform');
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <UserLoginForm onSubmit={handleLogin} loading={loading} error={error} />
    </div>
  );
};

export default UserLoginPage;
