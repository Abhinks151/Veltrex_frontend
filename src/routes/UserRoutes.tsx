// import UserDashBoard from "@/features/user/pages/UserDashBoard";
import { Route, Routes } from 'react-router-dom';

import React, { Suspense } from 'react';
import Loader from '@/pages/Loader';
import UserLayout from '@/features/user/components/userLayout';
import NotFoundPage from '@/pages/NotFoundPage';

import RoleProtectedRoute from '@/pages/RoleProtectedRoute';
import { Roles } from '@/shared/constants/rolesEnum';

const UserDashBoard = React.lazy(
  () => import('@/features/user/pages/UserDashBoard'),
);
const UserProfilePage = React.lazy(
  () => import('@/features/user/pages/UserProfilePage'),
);
const MachineDashBoard = React.lazy(
  () => import('@/features/machine/pages/MachineDashBoard'),
);
const FixtureDashBoard = React.lazy(
  () => import('@/features/fixture/pages/FixtureDashBoard'),
);

const UserRoutes = () => {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route element={<UserLayout />}>
            <Route path="/" element={<UserDashBoard />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/employees" element={<UserDashBoard />} />

            <Route
              element={<RoleProtectedRoute allowedRoles={[Roles.ADMIN]} />}
            >
              <Route path="/machines" element={<MachineDashBoard />} />
              <Route path="/fixtures" element={<FixtureDashBoard />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

export default UserRoutes;
