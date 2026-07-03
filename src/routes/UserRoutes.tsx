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
const RawMaterialDashBoard = React.lazy(
  () => import('@/features/raw-material/pages/RawMaterialDashBoard'),
);
const EmployeeDashBoard = React.lazy(
  () => import('@/features/employee/pages/EmployeeDashBoard'),
);
const JobDashBoard = React.lazy(
  () => import('@/features/job/pages/JobDashBoard'),
);
const PartDashBoard = React.lazy(
  () => import('@/features/part/pages/PartDashBoard'),
);
const ShiftTemplateDashboard = React.lazy(
  () => import('@/features/shift/pages/ShiftTemplateDashboard'),
);
const ProductionShiftDashboard = React.lazy(
  () => import('@/features/shift/pages/ProductionShiftDashboard'),
);
const NcProgramDashBoard = React.lazy(
  () => import('@/features/ncProgram/pages/NcProgramDashBoard'),
);

const UserRoutes = () => {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route element={<UserLayout />}>
            <Route path="/" element={<UserDashBoard />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/shifts" element={<ProductionShiftDashboard />} />

            <Route
              element={<RoleProtectedRoute allowedRoles={[Roles.ADMIN]} />}
            >
              <Route path="/jobs" element={<JobDashBoard />} />
              <Route path="/employees" element={<EmployeeDashBoard />} />
              <Route path="/machines" element={<MachineDashBoard />} />
              <Route path="/fixtures" element={<FixtureDashBoard />} />
              <Route path="/raw-materials" element={<RawMaterialDashBoard />} />
              <Route path="/parts" element={<PartDashBoard />} />
              <Route path="/nc-programs" element={<NcProgramDashBoard />} />
              <Route
                path="/shift-templates"
                element={<ShiftTemplateDashboard />}
              />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

export default UserRoutes;
