import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { getTenant } from '@/features/tenant/tenantThunk';
import { useEffect } from 'react';

const AdminDashBoard = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getTenant());
  }, [dispatch]);

  const { user } = useAppSelector((state) => state.auth);
  const { name } = useAppSelector((state) => state.tenant);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <p className="text-gray-600">
          Welcome{' '}
          <span className="font-semibold text-gray-900">{user?.name}</span>
        </p>
        <p className="text-gray-600">
          Your organization name is{' '}
          <span className="font-semibold text-gray-900">{name}</span>
        </p>
        <p className="text-gray-600 mt-2">
          Your role is{' '}
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#4f46e5]/10 text-[#4f46e5] capitalize">
            {user?.role}
          </span>
        </p>
      </div>
      <div>Admin Dashboard</div>
    </div>
  );
};

export default AdminDashBoard;
