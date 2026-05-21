import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import PlatformNavbar from '@/shared/components/custom/PlatformNavbar';

const UserLayout = () => {
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
