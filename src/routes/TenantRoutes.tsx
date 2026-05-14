// import TenantPage from "@/features/tenant/pages/TenantPage";
// import UpdateTenantPage from "@/features/tenant/pages/UpdateTenantPage";
import { Route, Routes } from "react-router-dom"

import React, { Suspense } from 'react';
import Loader from "@/pages/Loader";
import NotFoundPage from "@/pages/NotFoundPage";

const TenantPage = React.lazy(() => import('@/features/tenant/pages/TenantPage'))
const UpdateTenantPage = React.lazy(() => import('@/features/tenant/pages/UpdateTenantPage'))

const TenantRoutes = () => {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="create" element={<TenantPage />} />
          <Route path="update" element={<UpdateTenantPage />} />

          <Route path="*" element={<NotFoundPage />} />

        </Routes>
      </Suspense>
    </>
  )
}

export default TenantRoutes;