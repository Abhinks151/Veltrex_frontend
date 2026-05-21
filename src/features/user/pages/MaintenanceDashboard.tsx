import { useAppSelector } from '@/app/store/hooks';

const MaintenanceDashboard = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <p className="text-gray-600">
          Welcome{' '}
          <span className="font-semibold text-gray-900">{user?.name}</span>
        </p>
        <p className="text-gray-600 mt-2">
          Your role is{' '}
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#4f46e5]/10 text-[#4f46e5] capitalize">
            {user?.role}
          </span>
        </p>
      </div>
      <div>Maintenance Dashboard</div>
    </div>
  );
};

export default MaintenanceDashboard;
