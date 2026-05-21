import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { forgotPassword } from '@/features/auth/authThunk';
import { notifyError, notifySuccess } from '@/shared/utils/toasterUtils';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  forgotPasswordSchema,
  type forgotPasswordFormData,
} from '@/features/auth/validators/forgot-password.schema';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Mail } from 'lucide-react';
import Error from '@/shared/components/custom/Error';
import { useEffect } from 'react';

const UserForgotPasswordPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      notifyError(error);
    }
  }, [error]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<forgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const handleForgotPassword = async (data: forgotPasswordFormData) => {
    try {
      await dispatch(
        forgotPassword({
          ...data,
          resetLink: `${window.location.origin}/platform/reset-password`,
        }),
      ).unwrap();
      notifySuccess(
        FRONTEND_MESSAGE_CONSTANTS.SUCCESS.PASSWORD_RESET_LINK_SENT,
      );
      navigate('/platform/login');
    } catch (err) {
      notifyError(err as string);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
        <div className="w-full text-center">
          <h2 className="text-xl font-semibold mb-1">Forgot Password</h2>
          <p className="text-sm text-gray-500 mb-6">
            Enter your email to receive a password reset link
          </p>
        </div>

        <form onSubmit={handleSubmit(handleForgotPassword)}>
          {/* Email */}
          <div className="mb-4">
            <label className="text-sm text-gray-600 mb-1 block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
              <Input
                placeholder="john@company.com"
                className="pl-10"
                {...register('email')}
              />
            </div>
            {errors.email && <Error message={errors.email.message} />}
          </div>

          {/* Button */}
          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            size="xl"
            className="w-full"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>

          <div className="text-center mt-4">
            <Link
              to="/platform/login"
              className="text-sm text-blue-500 hover:text-blue-600 hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForgotPasswordPage;
