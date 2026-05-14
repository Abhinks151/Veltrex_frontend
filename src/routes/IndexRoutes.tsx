import Alert from '@/pages/dev/Alret';
import { Roles } from '@/shared/constants/rolesEnum';
import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
// import AuthRoutes from './AuthRoutes';
// import LandingPage from '@/pages/LandingPage';
// import HomePage from '@/pages/HomePage';
// import Sample from '@/pages/dev/Sample';
// import ProtectedRoute from '@/pages/ProtectedRoute';
// import RoleProtectedRoute from '@/pages/RoleProtectedRoute';
// import TenantRoutes from './TenantRoutes';
// import LoginPage from '@/features/super-admin/pages/LoginPage';
// import SuperAdminRoutes from './Super-adminRoutes';
// import UnauthorizedPage from '@/pages/UnauthorizedPage';
// import { Roles } from '@/shared/constants/rolesEnum';
// import UserLoginPage from '@/features/user/pages/UserLoginPage';
// import UserRoutes from './UserRoutes';
// import TableSample from '@/pages/dev/TableSample';
// import Menu from '@/pages/dev/Menu';
// import PricingPage from '@/pages/PricingPage';
// import NotFoundPage from '@/pages/NotFoundPage';
// import Loader from '@/pages/Loader';

const AuthRoutes = React.lazy(() => import('./AuthRoutes'))
const LandingPage = React.lazy(() => import('@/pages/LandingPage'))
const HomePage = React.lazy(() => import('@/pages/HomePage'))
const Sample = React.lazy(() => import('@/pages/dev/Sample'))
const ProtectedRoute = React.lazy(() => import('@/pages/ProtectedRoute'))
const RoleProtectedRoute = React.lazy(() => import('@/pages/RoleProtectedRoute'))
const TenantRoutes = React.lazy(() => import('./TenantRoutes'))
const LoginPage = React.lazy(() => import('@/features/super-admin/pages/LoginPage'))
const SuperAdminRoutes = React.lazy(() => import('./Super-adminRoutes'))
const UnauthorizedPage = React.lazy(() => import('@/pages/UnauthorizedPage'))
const UserLoginPage = React.lazy(() => import('@/features/user/pages/UserLoginPage'))
const UserRoutes = React.lazy(() => import('./UserRoutes'))
const TableSample = React.lazy(() => import('@/pages/dev/TableSample'))
const Menu = React.lazy(() => import('@/pages/dev/Menu'))
const PricingPage = React.lazy(() => import('@/pages/PricingPage'))
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'))
const Loader = React.lazy(() => import('@/pages/Loader'))
const OnboardingPage = React.lazy(() => import('@/pages/OnboardingPage'))
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'))
const ChangePasswordPage = React.lazy(() => import('@/pages/ChangePasswordPage'))


const IndexRoutes = () => {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/*" element={<AuthRoutes />} />
          <Route path="/super-admin/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/platform/login" element={<UserLoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<RoleProtectedRoute allowedRoles={[Roles.ADMIN]} />}>
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/tenant/*" element={<TenantRoutes />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/change-password" element={<ChangePasswordPage />} />
            </Route>


            <Route element={<RoleProtectedRoute allowedRoles={[Roles.ADMIN, Roles.MACHINIST, Roles.MAINTENANCE]} />}>
              <Route path="/platform/*" element={<UserRoutes />} />
            </Route>


            <Route element={<RoleProtectedRoute allowedRoles={[Roles.SUPER_ADMIN]} />}>
              <Route path="/super-admin/*" element={<SuperAdminRoutes />} />
            </Route>
          </Route>

          <Route path="/sample" element={<Sample />} />
          <Route path="/table" element={<TableSample />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/loader" element={<Loader />} />
          <Route path="/alert" element={<Alert />} />


          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default IndexRoutes;
