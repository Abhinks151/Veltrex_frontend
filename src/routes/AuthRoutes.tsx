// import EmailVerificationRequestPage from "@/features/auth/pages/EmailVerificationRequestPage";
// import LoginPage from "@/features/auth/pages/LoginPage"
// import RegisterPage from "@/features/auth/pages/RegisterPage";
// import VerifyEmail from "@/features/auth/pages/VerifyEmail";
// import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
// import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";
import { Route, Routes } from "react-router-dom"
import React, { Suspense } from 'react';
import Loader from "@/pages/Loader";
import NotFoundPage from "@/pages/NotFoundPage";

const EmailVerificationRequestPage = React.lazy(() => import('@/features/auth/pages/EmailVerificationRequestPage'))
const LoginPage = React.lazy(() => import('@/features/auth/pages/LoginPage'))
const RegisterPage = React.lazy(() => import('@/features/auth/pages/RegisterPage'))
const VerifyEmail = React.lazy(() => import('@/features/auth/pages/VerifyEmail'))
const ForgotPasswordPage = React.lazy(() => import('@/features/auth/pages/ForgotPasswordPage'))
const ResetPasswordPage = React.lazy(() => import('@/features/auth/pages/ResetPasswordPage'))

const AuthRoutes = () => {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="check-email" element={<EmailVerificationRequestPage />} />
          <Route path="verify" element={<VerifyEmail />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default AuthRoutes;