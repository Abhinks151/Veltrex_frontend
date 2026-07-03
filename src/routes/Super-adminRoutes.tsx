import { Route, Routes } from 'react-router-dom';
// import SuperAdminLayout from "@/features/super-admin/components/SuperAdminLayout"
// import DashBoard from "@/features/super-admin/pages/DashBoard"
// import TenantsPage from "@/features/super-admin/pages/TenantsPage"

import React, { Suspense } from 'react';
import Loader from '@/pages/Loader';
import UsersPage from '@/features/super-admin/pages/UsersPage';
import NotFoundPage from '@/pages/NotFoundPage';

const SuperAdminLayout = React.lazy(
  () => import('@/features/super-admin/components/SuperAdminLayout'),
);
const DashBoard = React.lazy(
  () => import('@/features/super-admin/pages/DashBoard'),
);
const TenantsPage = React.lazy(
  () => import('@/features/super-admin/pages/TenantsPage'),
);
const PlansPage = React.lazy(
  () => import('@/features/super-admin/pages/PlansDashboard'),
);

const SuperAdminRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<SuperAdminLayout />}>
          <Route path="/" element={<DashBoard />} />
          <Route path="/tenants" element={<TenantsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default SuperAdminRoutes;
