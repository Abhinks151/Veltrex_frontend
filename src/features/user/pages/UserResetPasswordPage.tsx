import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { resetPassword } from '@/features/auth/authThunk';
import { notifyError, notifySuccess } from '@/shared/utils/toasterUtils';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  resetPasswordSchema,
  type resetPasswordFormData,
} from '@/features/auth/validators/reset-password.schema';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import Error from '@/shared/components/custom/Error';

const UserResetPasswordPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

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
  } = useForm<resetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const handleResetPassword = async (data: resetPasswordFormData) => {
    if (!token) {
      notifyError(FRONTEND_MESSAGE_CONSTANTS.ERROR.INVALID_RESET_LINK);
      return;
    }

    try {
      await dispatch(
        resetPassword({ token, password: data.password }),
      ).unwrap();
      notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.PASSWORD_RESET);
      navigate('/platform/login');
    } catch (err) {
      notifyError(err as string);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
        {!token ? (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2 text-red-500">
              Invalid Reset Link
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              This password reset link is invalid or has expired.
            </p>
            <a
              href="/platform/forgot-password"
              className="text-blue-500 hover:text-blue-600 hover:underline text-sm"
            >
              Request a new reset link
            </a>
          </div>
        ) : (
          <>
            <div className="w-full text-center">
              <h2 className="text-xl font-semibold mb-1">Reset Password</h2>
              <p className="text-sm text-gray-500 mb-6">
                Enter your new password below.
              </p>
            </div>

            <form onSubmit={handleSubmit(handleResetPassword)}>
              {/* Password */}
              <div className="mb-4">
                <label className="text-sm text-gray-600 mb-1 block">
                  New Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                />
                {errors.password && <Error message={errors.password.message} />}
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <label className="text-sm text-gray-600 mb-1 block">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <Error message={errors.confirmPassword.message} />
                )}
              </div>

              {/* Button */}
              <Button
                type="submit"
                disabled={loading}
                variant="primary"
                size="xl"
                className="w-full mt-4"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default UserResetPasswordPage;
