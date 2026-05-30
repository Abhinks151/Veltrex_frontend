import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import PlatformNavbar from '@/shared/components/custom/PlatformNavbar';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { useEffect } from 'react';
import { getSubscription } from '@/features/subscription/subscriptionThunk';
import Loader from '@/pages/Loader';

const UserLayout = () => {
  const dispatch = useAppDispatch();
  const { status, loading, id, endDate, initialized } = useAppSelector(
    (state) => state.subscription,
  );
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getSubscription());
  }, [dispatch]);

  const isExpired = endDate && new Date(endDate) < new Date();
  const shouldBlock =
    !id || status === 'CANCELLED' || status === 'EXPIRED' || isExpired;

  if (loading || !initialized) {
    return <Loader />;
  }

  if (shouldBlock && user?.role !== 'SUPER_ADMIN') {
    if (status === 'CANCELLED') {
      return <Navigate to="/subscription-cancelled" replace />;
    }
    return <Navigate to="/subscription-expired" replace />;
  }

  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden bg-white">
        <PlatformNavbar />
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
