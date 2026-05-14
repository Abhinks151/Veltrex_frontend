import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
// import { useState } from 'react';
import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Error from '@/shared/components/custom/Error';
import { notifyError } from '@/shared/utils/toasterUtils';
import { useEffect } from 'react';
import type { LoginFormProps } from '@/features/auth/types/propsTypes';
import { loginSchema, type loginFormData } from '@/features/auth/validators/login.schema';

const SuperAdminLoginForm = ({ onSubmit, loading, error }: LoginFormProps) => {
  // const [email, setEmail] = useState<string>('');
  // const [password, setPassword] = useState<string>('');
  useEffect(() => {
    if (error) {
      notifyError(error);
    }
  }, [error]);
  const { register, handleSubmit, formState: { errors } } = useForm<loginFormData>({
    resolver: zodResolver(loginSchema)
  })



  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-md p-8 w-[100]"
      >
        <div className='w-full text-center'>
          <h2 className="text-xl font-semibold mb-1">
            Sign In
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            Log in to veltrex
          </p>
        </div>

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

        {/* Password */}
        <div className="mb-4">
          <label className="text-sm text-gray-600 mb-1 block">
            Password
          </label>

          <Input
            type="password"
            placeholder="••••••••"
            {...register("password")}
          />
        </div>

        {errors.email && <Error message={errors.email.message} />}
        {errors.password && <Error message={errors.password.message} />}


        {/* Button */}
        <Button
          type="submit"
          disabled={loading}
          variant="primary"
          size="xl"
          className="w-full"
        >
          {loading ? 'Login...' : 'Login'}
        </Button>

      </form>
    </div>
  );
};

export default SuperAdminLoginForm;
