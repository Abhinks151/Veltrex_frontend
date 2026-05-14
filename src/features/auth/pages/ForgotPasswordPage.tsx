import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import type { ForgotPasswordRequest } from '../types';
import { forgotPassword } from '../authThunk';
import { notifyError, notifySuccess } from '@/shared/utils/toasterUtils';
import { useNavigate } from 'react-router-dom';
import { FRONTEND_MESSAGE_CONSTANTS } from '../../../shared/constants/messageConstants';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleForgotPassword = async (data: ForgotPasswordRequest) => {
    try {
      await dispatch(forgotPassword(data)).unwrap();
      notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.PASSWORD_RESET_LINK_SENT);
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
        <ForgotPasswordForm
          onSubmit={handleForgotPassword}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
