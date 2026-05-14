// import { Button } from '@/shared/components/ui/button';
// import { Input } from '@/shared/components/ui/input';
// import type { LoginFormProps } from '../types/propsTypes';
// import { useState } from 'react';

// const LoginForm = ({ onSubmit, loading, error }: LoginFormProps) => {
//   const [email, setEmail] = useState<string>('');
//   const [password, setPassword] = useState<string>('');

//   return (
//     <div>
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           onSubmit({ email, password });
//           setEmail("")
//           setPassword("")
//         }}
//       >
//         <Input
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <Input
//           placeholder="Password"
//           value={password}
//           type="password"
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <div>
//           <h1>{error}</h1>
//         </div>

//         <Button type='submit' disabled={loading} variant="default" size={'lg'}>
//           {loading ? 'Loaging in' : 'Login'}
//         </Button>
//       </form>
//     </div>
//   );
// };

// export default LoginForm;



import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import type { LoginFormProps } from '../types/propsTypes';
// import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { loginSchema, type loginFormData } from '../validators/login.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import Error from '@/shared/components/custom/Error';
import { notifyError } from '@/shared/utils/toasterUtils';
import { useEffect } from 'react';

const LoginForm = ({ onSubmit, loading, error }: LoginFormProps) => {
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
        <h2 className="text-xl font-semibold mb-1">
          Sign In
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          Welcome back! Please enter your details.
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

        {/* Error */}
        {/* {errors.email && <p>{errors.email.message}</p>}
        {errors.password && <p>{errors.password.message}</p>}
        {error && <p>{error}</p>} */}
        {/* {error && <Error message={error} />} */}
        {errors.email && <Error message={errors.email.message} />}
        {errors.password && <Error message={errors.password.message} />}


        {/* Forgot Password link */}
        <div className="text-right mb-4">
          <Link
            to="/auth/forgot-password"
            className="text-sm text-blue-500 hover:text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

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


        <div className="text-center mt-4">
          <p>Don't have an account? <Link to="/auth/register" className="text-blue-500 hover:text-blue-600 hover:underline cursor-pointer">Register</Link></p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
