import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import type { ResetPasswordFormProps } from '../types/propsTypes';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { resetPasswordSchema, type resetPasswordFormData } from '../validators/reset-password.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import Error from '@/shared/components/custom/Error';
import { notifyError } from '@/shared/utils/toasterUtils';
import { useEffect } from 'react';

const ResetPasswordForm = ({ onSubmit, loading, error }: ResetPasswordFormProps) => {
  useEffect(() => {
    if (error) {
      notifyError(error);
    }
  }, [error]);

  const { register, handleSubmit, formState: { errors } } = useForm<resetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const handleFormSubmit = (data: resetPasswordFormData) => {
    // console.log(data);
    onSubmit({ password: data.password });
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="bg-white rounded-xl shadow-md p-8 w-[100]"
      >
        <h2 className="text-xl font-semibold mb-1">
          Reset Password
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          Enter your new password below.
        </p>

        {/* New Password */}
        <div className="mb-4">
          <label className="text-sm text-gray-600 mb-1 block">
            New Password
          </label>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
            <Input
              type="password"
              placeholder="••••••••"
              className="pl-10"
              {...register("password")}
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label className="text-sm text-gray-600 mb-1 block">
            Confirm Password
          </label>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
            <Input
              type="password"
              placeholder="••••••••"
              className="pl-10"
              {...register("confirmPassword")}
            />
          </div>
        </div>

        {/* Validation errors */}
        {errors.password && <Error message={errors.password.message} />}
        {errors.confirmPassword && <Error message={errors.confirmPassword.message} />}

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          variant="primary"
          size="xl"
          className="w-full"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </Button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            Remembered your password?{' '}
            <Link to="/auth/login" className="text-blue-500 hover:text-blue-600 hover:underline cursor-pointer">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
