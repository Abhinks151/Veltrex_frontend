import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import ResetPasswordForm from '../components/ResetPasswordForm';
import type { ResetPasswordRequest } from '../types';
import { resetPassword } from '../authThunk';
import { notifyError, notifySuccess } from '@/shared/utils/toasterUtils';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FRONTEND_MESSAGE_CONSTANTS } from '../../../shared/constants/messageConstants';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleResetPassword = async (data: ResetPasswordRequest) => {
    if (!token) {
      notifyError(FRONTEND_MESSAGE_CONSTANTS.ERROR.INVALID_RESET_LINK);
      return;
    }

    try {
      await dispatch(resetPassword({ token, password: data.password })).unwrap();
      notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.PASSWORD_RESET);
      navigate('/auth/login');
    } catch (error) {
      notifyError(error as string);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE */}
      <div className="w-1/2 bg-[#3B2E8C] text-white flex flex-col justify-center text-center gap-10 items-center p-12">
        <h1 className="text-4xl font-bold max-w-md">
          Precision management for the modern shop floor.
        </h1>
        <div className="mt-12 bg-white/10 py-20 rounded-2xl p-8 flex items-center justify-center">
          <div className="flex items-end gap-6 h-48">
            <div className="w-12 h-20 bg-white/30 rounded" />
            <div className="w-12 h-32 bg-orange-400 rounded" />
            <div className="w-12 h-24 bg-white/30 rounded" />
            <div className="w-12 h-40 bg-white/50 rounded" />
            <div className="w-12 h-20 bg-white/30 rounded" />
            <div className="w-12 h-48 bg-orange-500 rounded" />
          </div>
        </div>

        <p className="text-white/70 max-w-md">
          Streamline your CNC production, monitor real-time analytics, and optimize your workflow.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 bg-gray-100 flex items-center justify-center">
        {!token ? (
          <div className="bg-white rounded-xl shadow-md p-8 w-[100] text-center">
            <h2 className="text-xl font-semibold mb-2 text-red-500">Invalid Reset Link</h2>
            <p className="text-sm text-gray-500 mb-4">
              This password reset link is invalid or has expired.
            </p>
            <a
              href="/auth/forgot-password"
              className="text-blue-500 hover:text-blue-600 hover:underline text-sm"
            >
              Request a new reset link
            </a>
          </div>
        ) : (
          <ResetPasswordForm
            onSubmit={handleResetPassword}
            loading={loading}
            error={error}
          />
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
