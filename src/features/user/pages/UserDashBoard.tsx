import { useAppSelector } from '@/app/store/hooks';
import { Roles } from '@/shared/constants/rolesEnum';
import AdminDashBoard from './AdminDashboard';
import MachinistDashboard from './MachinistDashboard';
// import MaintenanceDashboard from './MaintenanceDashboard';
import MaintenanceTechnicianDashboard from '@/features/maintenance/pages/MaintenanceTechnicianDashboard';

export default function UserDashboard() {
  const user = useAppSelector((state) => state.auth.user);

  if (user?.role === Roles.ADMIN) {
    return <AdminDashBoard />;
  }

  if (user?.role === Roles.MACHINIST) {
    return <MachinistDashboard />;
  }

  if (user?.role === Roles.MAINTENANCE) {
    // return <MaintenanceDashboard />;
    return <MaintenanceTechnicianDashboard />;
  }
}
