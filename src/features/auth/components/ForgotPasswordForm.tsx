import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import type { ForgotPasswordFormProps } from '../types/propsTypes';
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { forgotPasswordSchema, type forgotPasswordFormData } from '../validators/forgot-password.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import Error from '@/shared/components/custom/Error';
import { notifyError } from '@/shared/utils/toasterUtils';
import { useEffect } from 'react';

const ForgotPasswordForm = ({ onSubmit, loading, error }: ForgotPasswordFormProps) => {
  useEffect(() => {
    if (error) {
      notifyError(error);
    }
  }, [error]);

  const { register, handleSubmit, formState: { errors } } = useForm<forgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-md p-8 w-[100]"
      >
        <h2 className="text-xl font-semibold mb-1">
          Forgot Password
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>

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
              {...register("email")}
            />
          </div>
        </div>

        {/* Validation error */}
        {errors.email && <Error message={errors.email.message} />}

        {/* Submit */}
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

export default ForgotPasswordForm;
