// import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
// import LoginForm from '../components/LoginForm';
// import type { LoginRequest } from '../types';
// import { loginUser } from '../authThunk';

// const LoginPage = () => {

//   const dispatch = useAppDispatch()

//   const handleLogin = async (data: LoginRequest) => {

//     dispatch(loginUser(data))

//   };

//   const { user, token, loading, error } = useAppSelector((state) => state.auth);

//   return (
//     <div>
//       <LoginForm
//         onSubmit={handleLogin}
//         loading={loading}
//         error={error}
//       />

//       <div className='mt-4 border border-red-700 p-4 rounded-md'>
//         <p>User: {user?.name}</p>
//         <p>Token: {token}</p>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import LoginForm from '../components/LoginForm';
import type { LoginRequest } from '../types';
import { loginUser } from '../authThunk';
import { useNavigate } from 'react-router-dom';
import { getTenant } from '@/features/tenant/tenantThunk';
import { getSubdomain, getSubdomainUrl } from '@/shared/utils/subdomain';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // const { name } = useAppSelector((state) => state.tenant);

  const handleLogin = async (data: LoginRequest) => {
    try {
      const result = await dispatch(loginUser(data)).unwrap();

      const user = result.data?.user;
      const subdomain = user?.subdomain;
      const currentSubdomain = getSubdomain();

      if (subdomain) {
        if (currentSubdomain === subdomain) {
          navigate('/platform');
        } else {
          window.location.href = getSubdomainUrl(subdomain, '/platform');
          return;
        }
      }

      const tenant = await dispatch(getTenant()).unwrap();
      if (tenant) {
        navigate('/platform');
      } else {
        navigate('/onboarding');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { loading, error } = useAppSelector((state) => state.auth);

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
          Streamline your CNC production, monitor real-time analytics, and
          optimize your workflow.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 bg-gray-100 flex items-center justify-center">
        <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default LoginPage;
