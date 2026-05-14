// import { Button } from '@/shared/components/ui/button';
// import { Input } from '@/shared/components/ui/input';
// import type { RegisterFormProps } from '../types/propsTypes';
// import { useState } from 'react';

// const RegisterForm = ({ onSubmit, loading, error }: RegisterFormProps) => {
//   const [name, setName] = useState<string>('');
//   const [email, setEmail] = useState<string>('');
//   const [password, setPassword] = useState<string>('');

//   return (
//     <div>
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           onSubmit({ name, email, password });
//           setName("")
//           setEmail("")
//           setPassword("")
//         }}
//       >
//         <Input
//           placeholder="Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
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
//           {loading ? 'Creating new account...' : 'Register'}
//         </Button>
//       </form>
//     </div>
//   );
// };

// export default RegisterForm;


import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import type { RegisterFormProps } from '../types/propsTypes';
// import { useState } from 'react';
import { User, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type registerFormData } from '../validators/register.schema';
import { useForm } from 'react-hook-form';
import Error from '@/shared/components/custom/Error';
import { notifyError } from '@/shared/utils/toasterUtils';
import { useEffect } from 'react';

const RegisterForm = ({ onSubmit, loading, error }: RegisterFormProps) => {
  // const [name, setName] = useState('');
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  useEffect(() => {
    if (error) {
      notifyError(error);
    }
  }, [error]);

  const { register, handleSubmit, formState: { errors } } = useForm<registerFormData>({
    resolver: zodResolver(registerSchema)
  })


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-xl shadow-md p-8 w-[100]"
    >
      <h2 className="text-xl font-semibold mb-1">
        Create your account
      </h2>

      <p className="text-sm text-gray-500 mb-6">
        Start your 30-day free trial today.
      </p>

      {/* Name */}
      <div className="mb-4">
        <label className="text-sm text-gray-600 mb-1 block">
          Full Name
        </label>

        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
          <Input
            placeholder="John Doe"
            className="pl-10"
            {...register("name")}
          />
        </div>
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

      {/* Error */}
      {/* {errors.name && <p>{errors.name.message}</p>}
      {errors.email && <p>{errors.email.message}</p>}
      {errors.password && <p>{errors.password.message}</p>}
      {error && <p>{error}</p>} */}
      {error && <Error message={error} />}
      {errors.name && <Error message={errors.name.message} />}
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
        {loading ? 'Creating account...' : 'Create Account'}
      </Button>


      <div className="text-center mt-4">
        <p>Already have an account? <Link to="/auth/login" className="text-blue-500 hover:text-blue-600 hover:underline cursor-pointer">Login</Link></p>
      </div>
    </form >
  );
};

export default RegisterForm;