// // import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
// // import LoginForm from '../components/LoginForm';
// // import type { LoginRequest } from '../types';
// // import { loginUser } from '../authThunk';

// import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
// import RegisterForm from "../components/RegisterForm";
// import type { RegisterRequest } from "../types";
// import { registerUser } from "../authThunk";
// import { useNavigate } from "react-router-dom";

// const RegisterPage = () => {

//   const dispatch = useAppDispatch()
//   const navigate = useNavigate()
//   const { loading, error } = useAppSelector((state) => state.auth);

//   const handleLogin = async (data: RegisterRequest) => {
//     try {
//       // console.log(data)
//       await dispatch(registerUser(data)).unwrap()
//       navigate("/auth/login");
//     } catch (error) {
//       console.log(error)
//     }
//   };

//   return (
//     <div>
//       <h1 className="text-center">Register Page</h1>
//       <RegisterForm
//         onSubmit={handleLogin}
//         loading={loading}
//         error={error}
//       />
//     </div>
//   );
// };

// export default RegisterPage;

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import RegisterForm from '../components/RegisterForm';
import type { RegisterRequest } from '../types';
import { registerUser } from '../authThunk';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleRegister = async (data: RegisterRequest) => {
    try {
      await dispatch(registerUser(data)).unwrap();
      navigate('/auth/check-email', { state: { email: data.email } });
    } catch (err) {
      console.log(err);
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
          Streamline your CNC production, monitor real-time analytics, and
          optimize your workflow.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 bg-gray-100 flex items-center justify-center">
        <RegisterForm
          onSubmit={handleRegister}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default RegisterPage;
